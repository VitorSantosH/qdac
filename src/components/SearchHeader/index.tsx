import { useNavigation, useRoute } from '@react-navigation/core';
import React, { useContext } from 'react';

import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Container, Text } from './styles';
import { ThemeContext } from 'styled-components';

interface IRouteParams {
  categoryId: string;
  category: string;
}

function SearchHeader() {
  const { colors } = useContext(ThemeContext);
  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as IRouteParams;

  return (
    <>
      <Container>
        <TouchableOpacity
          style={{ marginRight: 25 }}
          onPress={() =>
            navigation.navigate('SubCategories', {
              category_id: routeParams.categoryId,
              category: routeParams.category,
            })
          }>
          <Icon name="chevron-left" size={35} color={colors.text} />
        </TouchableOpacity>

        <Text>Perguntas</Text>

        <TouchableOpacity
          style={{ marginRight: 25 }}
          onPress={() => navigation.navigate('Profile')}>
          <Icon
            name="settings"
            size={30}
            style={{ paddingLeft: 27 }}
            color={colors.text}
          />
        </TouchableOpacity>
      </Container>
    </>
  );
}

export default SearchHeader;
