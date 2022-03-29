import { useNavigation } from '@react-navigation/core';
import React, { useCallback, useRef } from 'react';
import { Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../hooks/auth';
import { useAuthModal } from '../../hooks/auth.modal';
import api from '../../services/api';

import { Modal, ModalHandles } from '../Modal';

import {
  Container,
  Description,
  Title,
  RoomContainer,
  UsersContainer,
} from './styles';
import { useTheme } from 'styled-components';

interface RoomCardProps {
  owner: string;
  title: string;
  users: string;
  id: string;
  category: string;
  subCategory: string;
  question: string;
  description: string;
  onLongPress: () => void;
}

interface IUser {
  id: string;
}

function RoomCard({
  owner,
  title,
  users,
  id,
  category,
  subCategory,
  question,
  description,
  onLongPress,
}: RoomCardProps) {
  const navigation = useNavigation();
  const { handleOpenModal } = useAuthModal();

  const joinRoomModalRef = useRef<ModalHandles>(null);
  const unauthenticatedUserModalRef = useRef<ModalHandles>(null);

  const { colors } = useTheme();
  const auth = useAuth();
  const user = auth.user as IUser;

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
      title,
      subCategory,
      category,
      users: Number(users) + 1,
      question,
      description,
    });
  }, [
    navigation,
    id,
    user,
    title,
    subCategory,
    category,
    users,
    question,
    description,
  ]);

  const handleEnterTheChat = useCallback(async () => {
    if (!user) {
      navigation.navigate('LandingPage');
    }

    const userRooms = await api.get(`/users/${user?.id}/rooms`);

    const isUserInTheRoom = userRooms.data.filter(room => room.room_id === id);

    if (isUserInTheRoom.length > 0) {
      navigation.navigate('Chat', {
        id,
        title,
        users,
        category,
        subCategory,
        question,
        description,
      });
    } else {
      joinRoomModalRef.current?.handleModalOpen();
    }
  }, [
    user,
    id,
    navigation,
    title,
    category,
    subCategory,
    users,
    question,
    description,
  ]);

  return (
    <>
      <Modal
        ref={joinRoomModalRef}
        description="Tem certeza que quer entrar nessa sala?"
        icon="edit"
        footerContentStyles={{
          flexDirection: 'row',
        }}
        footer={({ handleModalClose }) => [
          {
            label: 'Sim',
            variant: 'solid',
            onPress: async () => {
              await handleJoinRoom();
              handleModalClose();
            },
            style: {
              width: 80,
              marginRight: 14,
            },
          },
          {
            label: 'Não',
            variant: 'outline',
            onPress: handleModalClose,
            style: {
              width: 80,
            },
          },
        ]}
      />

      <Modal
        ref={unauthenticatedUserModalRef}
        description="Para entrar em uma sala, entre com sua conta!"
        footer={({ handleModalClose }) => [
          {
            label: 'Fazer login',
            variant: 'solid',
            onPress: () => {
              handleModalClose();
              handleOpenModal('sign-in');
            },
          },
          {
            label: 'Criar conta',
            variant: 'solid',
            onPress: () => {
              handleModalClose();
              handleOpenModal('sign-up');
            },
          },
          {
            label: 'Ok',
            variant: 'outline',
            onPress: handleModalClose,
          },
        ]}
      />

      <Container
        onPress={() => {
          if (!user) {
            unauthenticatedUserModalRef.current?.handleModalOpen();

            return;
          }

          handleEnterTheChat();
        }}
        onLongPress={onLongPress}>
        <Description>Criado por {owner}</Description>

        <RoomContainer>
          <Title>{title}</Title>
          <UsersContainer>
            <Description>{users} / 100</Description>
            <Icon
              name="users"
              size={20}
              color={colors.textSecundary}
              style={{ marginLeft: 4 }}
            />
          </UsersContainer>
        </RoomContainer>
      </Container>
    </>
  );
}

export default RoomCard;
