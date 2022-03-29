/* eslint-disable prettier/prettier */
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/core';
import { ThemeContext } from 'styled-components';
import TopBar from './topBar.routes';
const Rooms = createStackNavigator();

const RoomsRoutes: React.FC = () => {
  const { colors } = useContext(ThemeContext);

  const navigation = useNavigation();

  return (
    <Rooms.Navigator
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
        headerRight: () => (
          <TouchableOpacity
            style={{ marginRight: 25 }}
            onPress={() => navigation.navigate('Settings')}>
            <Icon name="settings" size={30} color={`${colors.text}`} />
          </TouchableOpacity>
        ),
      }}>
      <Rooms.Screen
        name="topBar"
        component={TopBar}
        options={{
          headerTitle: 'Salas',
          headerTintColor: `${colors.text}`,

          headerLeft: () => null,
        }}
      />
    </Rooms.Navigator>
  );
};

export default RoomsRoutes;
