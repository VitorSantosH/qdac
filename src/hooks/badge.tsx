import React, { createContext, useEffect, useState } from 'react';
import firebase from 'firebase';

import api from '../services/api';
import { useAuth } from './auth';

interface BadgeContextData {
  notificationsBadge: number;
  messagesNotificationsBadge: number;
  changeBadge: (value: number) => void;
}

type MessagesNotifications = Record<string, any>;

export const BadgeContext = createContext({} as BadgeContextData);

export function BadgeProvider({ children }) {
  const { user } = useAuth();

  const [notificationsBadge, setNotificationsBadge] = useState(0);
  const [messagesNotificationsBadge, setMessagesNotificatiosBadge] = useState(
    0,
  );

  function changeBadge(value: number) {
    setNotificationsBadge(value);
  }

  useEffect(() => {
    if (!user) {
      return;
    }

    async function loadNotificationsCount() {
      const notificationCount = await api.get(
        `/notifications/count/${user?.id}`,
      );

      setNotificationsBadge(notificationCount.data);
    }

    loadNotificationsCount();
  }, [user?.id, user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    firebase
      .database()
      .ref('/notifications/messages')
      .orderByChild('to_user_id')
      .equalTo(user?.id)
      .on('value', snapshot => {
        if (!snapshot) {
          return;
        }

        const notificationMessagesSnapshot = snapshot.val();
        const firebaseNotificationMessages: MessagesNotifications =
          notificationMessagesSnapshot ?? {};

        const parsedNotificationMessages = Object.entries(
          firebaseNotificationMessages,
        );

        setMessagesNotificatiosBadge(parsedNotificationMessages.length);
      });
  }, [user?.id, user]);

  return (
    <BadgeContext.Provider
      value={{ notificationsBadge, messagesNotificationsBadge, changeBadge }}>
      {children}
    </BadgeContext.Provider>
  );
}
