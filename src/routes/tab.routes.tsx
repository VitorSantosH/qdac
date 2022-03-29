import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeContext } from 'styled-components';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import HomeRoutes from './home.routes';
import CategoriesRoutes from './categories.routes';
import RoomsRoutes from './rooms.routes';
import NotificationsRoutes from './notifications.routes';
import UserQuestions from './UserQuestions.routes';

import { BadgeContext } from '../hooks/badge';
import { useAuth } from '../hooks/auth';

const Tab = createBottomTabNavigator();

const TabRoutes: React.FC = () => {
  const { colors } = useContext(ThemeContext);
  const { notificationsBadge, messagesNotificationsBadge } = useContext(
    BadgeContext,
  );
  const { user } = useAuth();

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: colors.primary,
        inactiveTintColor: colors.text,
        style: {
          elevation: 0,
          shadowOpacity: 0,
          backgroundColor: colors.background,
          borderTopWidth: 0.5,
          borderTopColor: '#5B5B5B',
          height: 58,
        },
        showLabel: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeRoutes}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home" size={25} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Categories"
        component={CategoriesRoutes}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="folder" size={25} color={color} />
          ),
          unmountOnBlur: false,
        }}
      />

      <Tab.Screen
        name="Rooms"
        component={RoomsRoutes}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color }) => (
            <Icon name="message-square" size={25} color={color} />
          ),
          tabBarBadge:
            messagesNotificationsBadge > 0
              ? messagesNotificationsBadge
              : undefined,
        }}
      />
      <Tab.Screen
        name="UserQuestions"
        component={UserQuestions}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color }) => (
            <MaterialIcon name="help-outline" size={27} color={color} />
          ),
        }}
        initialParams={{
          userId: user?.id,
          isEditable: true,
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationsRoutes}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="bell" size={25} color={color} />
          ),
          tabBarBadge:
            notificationsBadge !== 0 ? notificationsBadge : undefined,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabRoutes;
