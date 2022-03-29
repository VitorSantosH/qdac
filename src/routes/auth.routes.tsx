import React, { useContext } from 'react';
import { Switch, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import FeatherIcon from 'react-native-vector-icons/Feather';

import { ThemeContext } from 'styled-components';

import LandingPage from '../pages/LandingPage';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import ForgotPasswordToken from '../pages/ForgotPasswordToken';
import Settings from '../pages/Settings';

import { goBack } from './RootNavigation';
import TabRoutes from './tab.routes';

import { ToggleThemeContext } from '../hooks/theme';

const Auth = createStackNavigator();

const AuthRoutes: React.FC = () => {
  const { colors, title } = useContext(ThemeContext);
  const { toggleTheme } = useContext(ToggleThemeContext);

  return (
    <Auth.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: colors.background },
        headerStyle: {
          backgroundColor: colors.headerBackground,
          height: 80,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomColor: colors.secundary,
          borderBottomWidth: 1,
        },
        headerTintColor: `${colors.text}`,
        headerTitleStyle: {
          fontFamily: 'Roboto-Bold',
          fontSize: 30,
        },
      }}>
      <Auth.Screen
        name="Tab"
        component={TabRoutes}
        options={{ headerShown: false, headerTintColor: `${colors.text}` }}
      />
      <Auth.Screen
        name="Settings"
        component={Settings}
        options={{
          title: 'Configurações',
          headerTintColor: `${colors.text}`,
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => goBack()}>
              <FeatherIcon
                name="chevron-left"
                size={35}
                color={`${colors.text}`}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Switch
              onValueChange={toggleTheme}
              value={title === 'dark'}
              trackColor={{ true: '#555', false: '#ddd' }}
              thumbColor={title === 'dark' ? '#000' : '#555'}
            />
          ),
        }}
      />
      <Auth.Screen name="LandingPage" component={LandingPage} />
      <Auth.Screen name="SignIn" component={SignIn} />
      <Auth.Screen name="SignUp" component={SignUp} />
      <Auth.Screen name="ForgotPassword" component={ForgotPassword} />
      <Auth.Screen name="ForgotPasswordToken" component={ForgotPasswordToken} />
    </Auth.Navigator>
  );
};

export default AuthRoutes;
