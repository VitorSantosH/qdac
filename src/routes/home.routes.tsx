/* eslint-disable prettier/prettier */
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from '../pages/Home';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/core';
import { ThemeContext } from 'styled-components';

const Home = createStackNavigator();

const HomeRoutes: React.FC = () => {
  const { colors } = useContext(ThemeContext);

  const navigation = useNavigation();

  return (
    <Home.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: colors.background },
        headerStyle: {
          backgroundColor: colors.headerBackground,
          height: 80,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.lineSeparator,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontFamily: 'Roboto-Bold',
          fontSize: 30,
        },
        headerLeft: () => null,
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 25 }}
            onPress={() => {
              navigation.navigate('Settings');
            }}>
            <Icon name="settings" size={30} color={`${colors.text}`} />
          </TouchableOpacity>
        ),
      }}>
      <Home.Screen
        name="Home"
        options={{ title: 'Início', headerTintColor: `${colors.text}` }}
        component={HomePage}
      />
    </Home.Navigator>
  );
};

export default HomeRoutes;
