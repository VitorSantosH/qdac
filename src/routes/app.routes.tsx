import React, { ReactNode, useContext, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Alert, TouchableOpacity } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { differenceInDays, parseISO } from 'date-fns';

import CancelNotifications from '../pages/CancelNotifications';
import Settings from '../pages/Settings';
import Chat from '../pages/Chat';
import Header from '../components/Header';
import RoomInfo from '../pages/RoomInfo';
import EditDescription from '../pages/EditDescription';
import Profile from '../pages/Profile';

import { ThemeContext } from 'styled-components';
import { BadgeProvider } from '../hooks/badge';
import { useAuth } from '../hooks/auth';

import api from '../services/api';
import { goBack, navigate } from './RootNavigation';

import TabRoutes from './tab.routes';
import { Appearance } from '../pages/Appearance';
import UserRoomsAndQuestions from './userRoomsAndQuestions.routes';
import {
  AdEventType,
  InterstitialAd,
  TestIds,
  firebase,
} from '@react-native-firebase/admob';
import { firebaseConfig } from '../../firebase';
import QandacHelp from '../pages/QandacHelp';
import AboutQandac from '../pages/AboutQandac';
import LandingPage from '../pages/LandingPage';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import ForgotPassword from '../pages/ForgotPassword';
import ForgotPasswordToken from '../pages/ForgotPasswordToken';
import { ChangeUsername } from '../pages/ChangeUsername';

const App = createStackNavigator();

interface RoutesAppNavigationProps {
  children: ReactNode;
}

function RoutesAppNavigation({ children }: RoutesAppNavigationProps) {
  const { colors } = useContext(ThemeContext);

  return (
    <BadgeProvider>
      <App.Navigator
        screenOptions={{
          cardStyle: { backgroundColor: colors.background },
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
        }}>
        {children}
      </App.Navigator>
    </BadgeProvider>
  );
}

function Routes() {
  const { user, signOut } = useAuth();
  const { colors } = useContext(ThemeContext);

  const showInterstitialAd = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    const interstitialAd = InterstitialAd.createForAdRequest(
      process.env.NODE_ENV === 'development'
        ? TestIds.INTERSTITIAL
        : 'ca-app-pub-4182205118133604/6614133011',
    );

    interstitialAd.onAdEvent(type => {
      if (type === AdEventType.LOADED) {
        interstitialAd.show();
      }
    });

    interstitialAd.load();

    return true;
  };

  useEffect(() => {
    async function loadUser() {
      if (!user) {
        return;
      }

      const { data } = await api.get(`/users/${user?.id}`);

      const blocked_date = parseISO(data.blocked_date);
      if (data.blocked_date) {
        if (differenceInDays(new Date(), blocked_date) < 5) {
          signOut();

          Alert.alert(
            'Usuário bloqueado',
            'Sua conta foi bloqueada temporiariamente você será deslogado da aplicação',
          );
        }
      }
    }

    loadUser();
  }, [user, signOut]);

  if (user && !user?.username) {
    return (
      <RoutesAppNavigation>
        <App.Screen
          name="ChangeUsername"
          component={ChangeUsername}
          options={{ headerShown: false }}
        />
      </RoutesAppNavigation>
    );
  }

  return (
    <RoutesAppNavigation>
      <App.Screen
        name="Tab"
        component={TabRoutes}
        options={{
          headerShown: false,
          headerTintColor: `${colors.text}`,
        }}
      />

      <App.Screen
        name="LandingPage"
        options={{ headerShown: false }}
        component={LandingPage}
      />
      <App.Screen
        name="SignIn"
        options={{ headerShown: false }}
        component={SignIn}
      />
      <App.Screen
        name="SignUp"
        options={{ headerShown: false }}
        component={SignUp}
      />
      <App.Screen
        name="ForgotPassword"
        options={{ headerShown: false }}
        component={ForgotPassword}
      />
      <App.Screen
        name="ForgotPasswordToken"
        component={ForgotPasswordToken}
        options={{ headerShown: false }}
      />

      <App.Screen
        name="Chat"
        component={Chat}
        options={({ route }: any) => ({
          header: () => (
            <Header
              question={route.params?.question}
              title={route.params?.title}
              subCategory={route.params?.subCategory}
              category={route.params?.category}
              users={route.params?.users}
              description={route.params?.description}
              id={route?.params.id}
            />
          ),
          headerTintColor: `${colors.text}`,
        })}
      />
      <App.Screen
        name="RoomInfo"
        component={RoomInfo}
        options={({ route }: any) => ({
          header: () => (
            <Header
              question={route.params?.question}
              title={route.params?.title}
              subCategory={route.params?.subCategory}
              category={route.params?.category}
              users={route.params?.users}
              isChat={false}
            />
          ),
          headerTintColor: `${colors.text}`,
        })}
      />
      <App.Screen
        name="EditDescription"
        component={EditDescription}
        options={({ route }: any) => ({
          header: () => (
            <Header
              question={route.params?.question}
              title={route.params?.title}
              subCategory={route.params?.subCategory}
              category={route.params?.category}
              users={route.params?.users}
              isChat={false}
            />
          ),
          headerTintColor: `${colors.text}`,
        })}
      />
      <App.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Conta',
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
          headerTintColor: `${colors.text}`,
        }}
      />
      <App.Screen
        name="Account"
        component={UserRoomsAndQuestions}
        options={({ route }: any) => ({
          title: 'Perfil',
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => {
                if (route.params?.isEditable) {
                  navigate('Settings');
                } else {
                  goBack();
                }
              }}>
              <FeatherIcon
                name="chevron-left"
                size={35}
                color={`${colors.text}`}
              />
            </TouchableOpacity>
          ),
          headerTintColor: `${colors.text}`,
        })}
      />
      <App.Screen
        name="Appearance"
        component={Appearance}
        options={{
          title: 'Aparência',
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
          headerTintColor: `${colors.text}`,
        }}
      />
      <App.Screen
        name="Settings"
        component={Settings}
        options={{
          title: 'Configurações',
          headerTintColor: `${colors.text}`,
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 10 }}
              onPress={() => {
                showInterstitialAd();
                goBack();
              }}>
              <FeatherIcon
                name="chevron-left"
                size={35}
                color={`${colors.text}`}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <App.Screen
        name="CancelNotifications"
        component={CancelNotifications}
        options={{
          title: 'Notificações',
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
        }}
      />

      <App.Screen
        name="QandacHelp"
        component={QandacHelp}
        options={{
          title: 'Ajuda do Qandac',
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
        }}
      />

      <App.Screen
        name="AboutQandac"
        component={AboutQandac}
        options={{
          title: 'Sobre o Qandac',
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
        }}
      />
    </RoutesAppNavigation>
  );
}

export default Routes;
