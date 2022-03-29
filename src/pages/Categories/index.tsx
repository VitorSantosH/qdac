import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import React, { useEffect, useState } from 'react';

import Card from '../../components/Card';
import api from '../../services/api';

import { Container, ScrollView, Description } from './styles';

interface Category {
  id: string;
  name: string;
  image: string;
  sub_category_count: number;
}

function Categories() {
  const [categories, setCategories] = useState<any>([]);

  useEffect(() => {
    async function loadCategories() {
      const { data } = await api.get<Category[]>('/categories');

      setCategories(data);
    }

    loadCategories();
  }, []);

  return (
    <Container>
      <BannerAd
        unitId={
          process.env.NODE_ENV === 'development'
            ? TestIds.BANNER
            : 'ca-app-pub-4182205118133604/8035381112'
        }
        size={BannerAdSize.SMART_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          marginTop: 8,
        }}
        keyExtractor={item => item.id}
        data={categories}
        numColumns={2}
        renderItem={({ item }) => (
          <Card
            id={item.id}
            title={item.name}
            description={
              item.sub_category_count < 1 
                ? `${item.sub_category_count} perguntas`
                : item.sub_category_count === 1
                  ? `${item.sub_category_count} subcategoria`
                  : `${item.sub_category_count} subcategorias`
            }
            image={item.image}
            category={item.name}
            nextRoute={item.sub_category_count > 0 ? "SubCategories" : "Questions"}
          />
        )}
        ListEmptyComponent={() => (
          <Description>Não há categorias no momento</Description>
        )}
      />
    </Container>
  );
}

export default Categories;
