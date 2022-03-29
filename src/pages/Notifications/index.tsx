import { useNavigation } from '@react-navigation/core';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { ActivityIndicator, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Notification from '../../components/Notification';
import { useAuth } from '../../hooks/auth';
import { BadgeContext } from '../../hooks/badge';
import api from '../../services/api';

import {
  Container,
  Header,
  Title,
  CenterView,
  Content,
  Description,
  ScrollView,
} from './styles';

function Notifications() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const { changeBadge } = useContext(BadgeContext);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleRemoveNotifications = useCallback(async () => {
    if (!user) {
      return;
    }

    if (notifications.length === 0) {
      return;
    }

    await api.delete(`/notifications/${user?.id}`);

    setNotifications([]);
    changeBadge(0);
  }, [user, changeBadge, notifications.length]);

  useEffect(() => {
    const loadNotifications = navigation.addListener('focus', async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await api.get(`/notifications/${user?.id}`);

      setNotifications(data);

      setLoading(false);
    });

    return loadNotifications;
  }, [navigation, user]);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#fafafa"
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      />
    );
  }

  return (
    <View style={{ backgroundColor: '#fffd00' }}>
      <Container>
        {notifications.length > 0 && (
          <Header>
            <TouchableOpacity onPress={handleRemoveNotifications}>
              <Title>Limpar</Title>
            </TouchableOpacity>
          </Header>
        )}

        {notifications.length > 0 ? (
          <ScrollView
            keyExtractor={item => item.id}
            data={notifications}
            renderItem={({ item }) => <Notification notificationProps={item} />}
          />
        ) : (
          <CenterView>
            <Content>
              <Icon name="notifications-none" size={100} color="#5A5860" />
              <Description>Não há notificações</Description>
            </Content>
          </CenterView>
        )}
      </Container>
    </View>
  );
}

export default Notifications;
