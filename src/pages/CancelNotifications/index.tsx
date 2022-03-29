import React, { useCallback, useContext, useEffect, useState } from 'react';

import { Switch } from 'react-native-gesture-handler';
import { ThemeContext } from 'styled-components';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import { Container, Title, SwitchView, Text } from './styles';

function CancelNotifications() {
  const { colors } = useContext(ThemeContext);
  const { user } = useAuth();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [emailsEnabled, setEmailsEnabled] = useState(false);

  const handleEmailChange = useCallback(async () => {
    if (emailsEnabled) {
      setEmailsEnabled(false);
      await api.post(
        'https://us6.api.mailchimp.com/3.0/lists/8a3f1b95b1',
        {
          members: [
            {
              email_address: user?.email,
              status: 'unsubscribed',
            },
          ],
          update_existing: true,
        },
        {
          headers: {
            Authorization: 'auth f5ac0399764f86c57406df0726b8ee90-us6',
          },
        },
      );
    } else {
      setEmailsEnabled(true);
      await api.post(
        'https://us6.api.mailchimp.com/3.0/lists/8a3f1b95b1',
        {
          members: [
            {
              email_address: user?.email,
              status: 'subscribed',
            },
          ],
          update_existing: true,
        },
        {
          headers: {
            Authorization: 'auth f5ac0399764f86c57406df0726b8ee90-us6',
          },
        },
      );
    }
  }, [emailsEnabled, user?.email]);

  const handleNotificationChange = useCallback(async () => {
    setNotificationsEnabled(!notificationsEnabled);

    await api.post(`/users/${user?.id}/notifications`);
  }, [user?.id, notificationsEnabled]);

  useEffect(() => {
    async function loadEmails() {
      const response = await api.post(
        'https://us6.api.mailchimp.com/3.0/lists/8a3f1b95b1',
        {
          members: [
            {
              email_address: user?.email,
            },
          ],
          update_existing: true,
        },
        {
          headers: {
            Authorization: 'auth f5ac0399764f86c57406df0726b8ee90-us6',
          },
        },
      );

      setEmailsEnabled(
        response.data.updated_members[0].status === 'subscribed',
      );
    }

    async function loadNotifications() {
      const response = await api.get(`/users/${user?.id}`);

      const isNotificationsEnabled = response.data.notifications;

      setNotificationsEnabled(isNotificationsEnabled);
    }

    loadNotifications();
    loadEmails();
  }, [user?.email, user?.id]);

  return (
    <Container>
      <Title>Notificações</Title>
      <SwitchView>
        <Text>Notificações dentro do aplicativo</Text>
        <Switch
          onValueChange={handleNotificationChange}
          value={notificationsEnabled}
          trackColor={{ true: colors.primary, false: '#9d9d9d' }}
          thumbColor="#fff"
        />
      </SwitchView>

      <Title>E-mails</Title>
      <SwitchView>
        <Text>Envio de E-mails</Text>
        <Switch
          onValueChange={handleEmailChange}
          value={emailsEnabled}
          trackColor={{ true: colors.primary, false: '#9d9d9d' }}
          thumbColor="#fff"
        />
      </SwitchView>
    </Container>
  );
}

export default CancelNotifications;
