/* eslint-disable prettier/prettier */
import React, { useContext, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import NotificationsPage from '../pages/Notifications';
import { useNavigation } from '@react-navigation/core';
import api from '../services/api';
import { BadgeContext } from '../hooks/badge';
import { useAuth } from '../hooks/auth';
import { ThemeContext } from 'styled-components';

const Notifications = createStackNavigator();

const NotificationsRoutes: React.FC = () => {
  const { colors } = useContext(ThemeContext);

  const navigation = useNavigation();

  const { user } = useAuth();
  const { changeBadge } = useContext(BadgeContext);

  useEffect(() => {
    const loadNotificationsCount = navigation.addListener('focus', async () => {
      if (!user) {
        return;
      }

      const notificationCount = await api.get(
        `/notifications/count/${user?.id}`,
      );

      changeBadge(notificationCount.data);
    });

    return loadNotificationsCount;
  }, [user, changeBadge, navigation]);

  return (
    <Notifications.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: '#312E38' },
        headerStyle: {
          backgroundColor: colors.headerBackground,
          height: 80,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.lineSeparator,
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
      <Notifications.Screen
        name="Notifications"
        component={NotificationsPage}
        options={{
          headerTitle: 'Notificações',
          headerTintColor: `${colors.text}`,
        }}
      />
    </Notifications.Navigator>
  );
};

export default NotificationsRoutes;
