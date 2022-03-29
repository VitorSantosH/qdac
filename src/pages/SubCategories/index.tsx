import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import { useNavigation, useRoute } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';

import { View } from 'react-native';
import { useTheme } from 'styled-components';
import Card from '../../components/Card';
import api from '../../services/api';

import { Container, Title, ScrollView, Description } from './styles';

interface IRouteParams {
  category_id: string;
  category: string;
  categoryId: string;
}

interface SubCategories {
  id: string;
  name: string;
  description: string;
  image: string;
  question_count: number;
  data: any;
}

function SubCategories() {
  const route = useRoute();
  const routeParams = route.params as IRouteParams;
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [subCategories, setSubCategories] = useState<SubCategories[]>([]);

  useEffect(() => {
    const loadSubCategories = navigation.addListener('focus', async () => {
      api
        .get<SubCategories[]>(
          `/categories/${routeParams.category_id}/sub-categories`,
        )
        .then(response => {
          setSubCategories(response.data.reverse());
        })
        .catch(error => {
          console.log(error.response);
        });
    });

    return loadSubCategories;
  }, [routeParams.category_id, navigation.addListener, navigation]);

  return (
    <View
      style={{
        backgroundColor: colors.background,
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}>
      <BannerAd
        unitId={
          process.env.NODE_ENV === 'development'
            ? TestIds.BANNER
            : 'ca-app-pub-4182205118133604/8035381112'
        }
        size={BannerAdSize.SMART_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />

      <Container>
        <Title>{routeParams.category}</Title>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
          }}
          keyExtractor={item => item.id}
          data={subCategories}
          numColumns={2}
          renderItem={({ item }) => (
            <Card
              id={item.id}
              title={item.name}
              description={
                item.question_count === 1
                  ? `${item.question_count} Pergunta`
                  : `${item.question_count} Perguntas`
              }
              image={item.image}
              nextRoute="Questions"
              sub_category={item.name}
              category={routeParams.category}
            />
          )}
          ListEmptyComponent={() => (
            <Description>Não há sub-categorias no momento</Description>
          )}
        />
      </Container>
    </View>
  );
}

export default SubCategories;
