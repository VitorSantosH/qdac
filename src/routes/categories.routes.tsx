/* eslint-disable prettier/prettier */
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CategoriesPage from '../pages/Categories';
import SubCategories from '../pages/SubCategories';
import Questions from '../pages/Questions';
import AddQuestion from '../pages/AddQuestion';
import { useNavigation } from '@react-navigation/core';
import QuestionRooms from '../pages/QuestionRooms';
import EditQuestion from '../pages/EditQuestion';
import { ThemeContext } from 'styled-components';

const Categories = createStackNavigator();

const CategoriesRoutes: React.FC = () => {
  const { colors } = useContext(ThemeContext);
  const navigation = useNavigation();

  return (
    <Categories.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: '#312E38' },
        headerStyle: {
          backgroundColor: colors.headerBackground,
          height: 80,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomColor: colors.lineSeparator,
          borderBottomWidth: 1,
        },
        headerTintColor: `${colors.text}`,
        headerTitleStyle: {
          fontFamily: 'Roboto-Bold',
          fontSize: 30,
        },
        headerLeft: () => null,
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 25 }}
            onPress={() => navigation.navigate('Settings')}>
            <Icon name="settings" size={30} color={`${colors.text}`} />
          </TouchableOpacity>
        ),
      }}>
      <Categories.Screen
        name="CategoriesPage"
        component={CategoriesPage}
        options={{
          headerTitle: 'Categorias',
          headerTintColor: `${colors.text}`,
        }}
      />

      <Categories.Screen
        name="SubCategories"
        component={SubCategories}
        options={{
          headerTitle: 'Sub-categorias',
          headerTintColor: `${colors.text}`,
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => navigation.navigate('CategoriesPage')}>
              <FeatherIcon
                name="chevron-left"
                size={35}
                color={`${colors.text}`}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Categories.Screen
        name="Questions"
        component={Questions}
        options={({ route }: any) => ({
          headerTitle: 'Perguntas',
          headerTintColor: `${colors.text}`,

          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => {
                if (route.params.sub_category !== undefined) {
                  navigation.navigate('SubCategories', {
                    category_id: route.params.categoryId,
                    category: route.params.category,
                    sub_category: route.params.subCategory,
                    categoryId: route.params.categoryId,
                  })
                } else {
                  navigation.navigate('CategoriesPage');
                }
              }}>
              <FeatherIcon name="chevron-left" size={35} color={colors.text} />
            </TouchableOpacity>
          ),
        })}
      />

      <Categories.Screen
        name="AddQuestion"
        component={AddQuestion}
        options={{
          headerTitle: 'Perguntas',
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => navigation.navigate('Questions')}>
              <FeatherIcon name="chevron-left" size={35} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <Categories.Screen
        name="EditQuestion"
        component={EditQuestion}
        options={{
          headerTitle: 'Perguntas',
          headerTintColor: `${colors.text}`,
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => navigation.navigate('Questions')}>
              <FeatherIcon name="chevron-left" size={35} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <Categories.Screen
        name="QuestionRooms"
        component={QuestionRooms}
        options={({ route }: any) => ({
          headerTitle: 'Salas',
          headerTintColor: `${colors.text}`,

          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() =>
                navigation.navigate('Questions', {
                  category_id: route.params.subCategoryId,
                  category: route.params.category,
                  sub_category: route.params.subCategory,
                  categoryId: route.params.categoryId,
                })
              }>
              <FeatherIcon name="chevron-left" size={35} color={colors.text} />
            </TouchableOpacity>
          ),
        })}
      />
    </Categories.Navigator>
  );
};

export default CategoriesRoutes;
