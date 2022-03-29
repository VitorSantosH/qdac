/* eslint-disable prettier/prettier */
import React, { useContext } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import UserRooms from '../pages/UserRooms';
import { ThemeContext } from 'styled-components';
import { Account } from '../pages/Account';
import { FlatList } from 'react-native-gesture-handler';
import UserQuestions from '../pages/UserQuestions';
import { useRoute } from '@react-navigation/core';

interface RouteParamsProps {
  isEditable: boolean;
  userName: string;
  userAvatar: string;
  userId: string;
}

const Tab = createMaterialTopTabNavigator();

export default function UserRoomsAndQuestions() {
  const { colors } = useContext(ThemeContext);
  const route = useRoute();
  const routeParams = route.params as RouteParamsProps;

  return (
    <FlatList
      style={{ flex: 1 }}
      data={[0]}
      renderItem={() => (
        <>
          <Account />

          <Tab.Navigator
            tabBarOptions={{
              style: {
                backgroundColor: colors.background,
              },
              labelStyle: {
                color: colors.text,
              },

              indicatorStyle: {
                backgroundColor: colors.primary,
              },
            }}>
            <Tab.Screen
              name="Perguntas criadas"
              component={UserQuestions}
              initialParams={{
                isProfile: true,
                isEditable: routeParams.isEditable,
                userId: routeParams.userId,
              }}
            />
            <Tab.Screen
              name="Salas criadas"
              component={UserRooms}
              initialParams={{
                isEditable: routeParams.isEditable,
                userId: routeParams.userId,
              }}
            />
          </Tab.Navigator>
        </>
      )}
    />
  );
}
