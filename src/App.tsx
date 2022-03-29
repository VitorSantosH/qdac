/* eslint-disable prettier/prettier */
import 'react-native-gesture-handler';
import { StatusBar, ActivityIndicator, LogBox } from 'react-native';
import React, { useEffect, useState } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import Routes from './routes';
import { NavigationContainer } from '@react-navigation/native';

import AppProvider from './hooks';
import { navigationRef } from './routes/RootNavigation';
import { ToggleThemeProvider } from './hooks/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App: React.FC = () => {
  const [theme, setTheme] = useState<string | null>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadValueOnAsyncStorage() {
      AsyncStorage.getItem('theme').then(userTheme => {
        setTheme(userTheme);
        LogBox.ignoreLogs(['Reanimated 2']);
        SplashScreen.hide();

        setLoading(false);
      });
    }

    loadValueOnAsyncStorage();
  }, [theme]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '198951319971-ihb2kebsrcu4419ae1mqkbj0ulorr3ha.apps.googleusercontent.com',
    });
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  } else {
    return (
      <SafeAreaProvider>
        <ToggleThemeProvider themeValue={theme}>
          <AppProvider>
            <StatusBar barStyle="light-content" backgroundColor="#312E38" />
            <NavigationContainer ref={navigationRef}>
              <Routes />
            </NavigationContainer>
          </AppProvider>
        </ToggleThemeProvider>
      </SafeAreaProvider>
    );
  }
};

export default App;
