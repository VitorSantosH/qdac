import { useNavigation } from '@react-navigation/core';
import React, { useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import { useTheme } from 'styled-components';
import { useAuth } from '../../hooks/auth';
import { Notification } from '../../hooks/chat';
import api from '../../services/api';
import { Modal, ModalHandles } from '../Modal';

import {
  Container,
  Description,
  QuestionTitle,
  Title,
  UsersView,
  UsersIcon,
  UnreadMessagesBadge,
} from './styles';

interface UserRoomCardProps {
  id: string;
  category: string;
  sub_category: string;
  room: string;
  question: string;
  users: string;
  description: string;
  onLongPress?(): void;
  notifications: Notification[];
}

interface Message {
  id: string;
  readAt: Date;
  user: {
    _id: string;
  };
}

function UserRoomCard({
  id,
  category,
  sub_category,
  room,
  question,
  users,
  description,
  onLongPress,
  notifications,
}: UserRoomCardProps) {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { colors } = useTheme();
  const joinRoomModalRef = useRef<ModalHandles>(null);

  const handleJoinRoom = useCallback(async () => {
    if (Number(users) === 100) {
      Alert.alert(
        'Não foi possível entrar nessa sala',
        'A sala em que voce deseja entrar está cheia.',
      );
      return;
    }

    await api.post('/rooms/participants', {
      user_id: user?.id,
      room_id: id,
    });
    navigation.navigate('Chat', {
      id,
      title: room,
      subCategory: sub_category,
      category,
      users: Number(users) + 1,
      question,
      description,
    });
  }, [
    navigation,
    id,
    user,
    category,
    users,
    question,
    description,
    room,
    sub_category,
  ]);

  const handleGoToChat = useCallback(async () => {
    const userRooms = await api.get(`/users/${user?.id}/rooms`);

    const isUserInTheRoom = userRooms.data.filter(room => room.room_id === id);

    if (isUserInTheRoom.length > 0) {
      navigation.navigate('Chat', {
        id,
        title: room,
        users,
        category,
        subCategory: sub_category,
        question,
        description,
      });
    } else {
      joinRoomModalRef.current?.handleModalOpen();
    }
  }, [
    navigation,
    id,
    category,
    sub_category,
    users,
    room,
    question,
    description,
    user?.id,
  ]);

  return (
    <>
      <Modal
        ref={joinRoomModalRef}
        description="Tem certeza que quer entrar nessa sala?"
        icon="edit"
        footer={({ handleModalClose }) => [
          {
            label: 'Sim',
            variant: 'solid',
            onPress: async () => {
              await handleJoinRoom();
              handleModalClose();
            },
          },
          {
            label: 'Não',
            variant: 'outline',
            onPress: handleModalClose,
          },
        ]}
      />

      <Container onPress={handleGoToChat} onLongPress={onLongPress}>
        <Description>{`${category} > ${sub_category} > ${room}`}</Description>
        <QuestionTitle numberOfLines={5}>
          <Title numberOfLines={5}>{question}</Title>
        </QuestionTitle>
        <UsersView>
          <Description>{`${users} / 100`}</Description>
          <UsersIcon name="users" size={20} color={colors.textSecundary} />
          {notifications.length > 0 && (
            <UnreadMessagesBadge>{notifications.length}</UnreadMessagesBadge>
          )}
        </UsersView>
      </Container>
    </>
  );
}

export default UserRoomCard;
