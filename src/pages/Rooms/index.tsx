import { useNavigation } from '@react-navigation/core';
import React, { useCallback, useEffect, useState, useRef } from 'react';

import UserRoomCard from '../../components/UserRoomCard';
import { Modal, ModalHandles } from '../../components/Modal';

import { useAuth } from '../../hooks/auth';
import { useChat } from '../../hooks/chat';
import api from '../../services/api';

import { Container, ScrollView, Description } from './styles';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import { EmptyStateWrapper } from '../UserQuestions/styles';
import LoginEmptyState from '../../components/LoginEmptyState';

interface IUser {
  id: string;
}

function Rooms() {
  const navigation = useNavigation();
  const auth = useAuth();
  const { fetchUnreadMessagesNotifications } = useChat();
  const user = auth.user as IUser;
  const leaveRoomModalRef = useRef<ModalHandles>(null);
  const [roomId, setRoomId] = useState('');

  const [rooms, setRooms] = useState<any>();

  useEffect(() => {
    const loadRooms = navigation.addListener('focus', async () => {
      const { data } = await api.get(`/users/${user?.id}/rooms`);

      const filterRooms = data.filter(room => room.room.owner_id !== user?.id);

      let roomList: any[] = [];

      filterRooms.map(item => {
        fetchUnreadMessagesNotifications(
          item.room.id,
          user?.id,
          unreadNotifications => {
            roomList.push({
              ...item,
              notifications: unreadNotifications,
            });
          },
        );
      });

      roomList.forEach((room, index) => {
        if (room.notifications.length > 0) {
          roomList.splice(index, 1);
          roomList.unshift(room);
        }
      });

      setRooms(roomList);
    });

    return loadRooms;
  }, [navigation, user?.id, fetchUnreadMessagesNotifications]);

  const handleLeaveRoom = useCallback(async () => {
    const newRooms = rooms.filter(room => room.room.id !== roomId);

    setRooms(newRooms);

    await api.delete(`rooms/${roomId}/participants/${user?.id}`);
  }, [roomId, rooms, user]);

  return (
    <>
      <Modal
        ref={leaveRoomModalRef}
        description="Tem certeza que deseja sair dessa sala?"
        icon="log-out"
        footerContentStyles={{
          flexDirection: 'row',
        }}
        footer={({ handleModalClose }) => [
          {
            label: 'Sim',
            variant: 'solid',
            onPress: async () => {
              await handleLeaveRoom();
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

      <Container>
        <ScrollView
          keyExtractor={item => item.id}
          contentContainerStyle={{
            marginTop: 16,
          }}
          data={rooms}
          renderItem={({ item, index }: any) => {
            if (index && (index + 1) % 6 === 0) {
              return (
                <>
                  <UserRoomCard
                    onLongPress={() => {
                      setRoomId(item.room.id);
                      leaveRoomModalRef.current?.handleModalOpen();
                    }}
                    id={item.room.id}
                    category={item.room.question.sub_category.category.name}
                    sub_category={item.room.question.sub_category.name}
                    room={item.room.name}
                    question={item.room.question.title}
                    users={item.participants_count}
                    description={item.room.description}
                    notifications={item.notifications}
                  />

                  <BannerAd
                    unitId={
                      process.env.NODE_ENV === 'development'
                        ? TestIds.BANNER
                        : 'ca-app-pub-4182205118133604/8035381112'
                    }
                    size={BannerAdSize.SMART_BANNER}
                    requestOptions={{ requestNonPersonalizedAdsOnly: true }}
                  />
                </>
              );
            } else {
              return (
                <UserRoomCard
                  onLongPress={() => {
                    setRoomId(item.room.id);
                    leaveRoomModalRef.current?.handleModalOpen();
                  }}
                  id={item.room.id}
                  category={item.room.question.sub_category.category.name}
                  sub_category={item.room.question.sub_category.name}
                  room={item.room.name}
                  question={item.room.question.title}
                  users={item.participants_count}
                  description={item.room.description}
                  notifications={item.notifications}
                />
              );
            }
          }}
          ListEmptyComponent={() => {
            if (!user) {
              return null;
            }

            return <Description>Você não entrou em nenhuma sala</Description>;
          }}
        />

        <EmptyStateWrapper>
          {!user && <LoginEmptyState type="room" />}
        </EmptyStateWrapper>
      </Container>
    </>
  );
}

export default Rooms;
