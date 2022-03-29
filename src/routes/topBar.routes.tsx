/* eslint-disable prettier/prettier */
import React, { useContext } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Rooms from '../pages/Rooms';
import UserRooms from '../pages/UserRooms';
import { ThemeContext } from 'styled-components';
import { useAuth } from '../hooks/auth';

const Tab = createMaterialTopTabNavigator();

export default function MyTabs() {
  const { colors } = useContext(ThemeContext);
  const { user } = useAuth();

  return (
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
      <Tab.Screen name="Salas" component={Rooms} />
      <Tab.Screen
        name="Suas salas"
        component={UserRooms}
        initialParams={{ userId: user?.id, isEditable: true }}
      />
    </Tab.Navigator>
  );
}
