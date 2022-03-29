import { useNavigation, useRoute } from '@react-navigation/core';
import React, { useCallback, useEffect, useState, useRef } from 'react';

import UserRoomCard from '../../components/UserRoomCard';
import { Modal, ModalHandles } from '../../components/Modal';

import { useAuth } from '../../hooks/auth';
import { useChat } from '../../hooks/chat';

import api from '../../services/api';

import { Container, ScrollView, Description } from './styles';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import LoginEmptyState from '../../components/LoginEmptyState';
import { EmptyStateWrapper } from '../UserQuestions/styles';

interface RouteParamsProps {
  isEditable: boolean;
  userId: string;
}

function UserRooms() {
  const navigation = useNavigation();
  const auth = useAuth();
  const deleteRoomModalRef = useRef<ModalHandles>(null);
  const { fetchUnreadMessagesNotifications } = useChat();
  const { user } = auth;
  const route = useRoute();
  const routeParams = route.params as RouteParamsProps;

  const [rooms, setRooms] = useState<any>();
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    const loadRooms = navigation.addListener('focus', async () => {
      if (!routeParams.userId) {
        if (user?.id) {
          routeParams.userId = user?.id;
        } else {
          setRooms([]);
          return;
        }
      }

      const { data } = await api.get(`/users/${routeParams.userId}/rooms`);

      console.log('userRooms', data);

      const filterRooms: any[] = data.filter(
        room => room.room.owner_id === routeParams.userId,
      );

      let roomList: any[] = [];

      if (routeParams.isEditable && user) {
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
      } else {
        roomList = filterRooms;
      }

      roomList.forEach((room, index) => {
        if (!room.notifications) {
          room.notifications = [];
        }

        if (room.notifications.length > 0) {
          roomList.splice(index, 1);
          roomList.unshift(room);
        }
      });

      setRooms(roomList);
    });

    return loadRooms;
  }, [
    navigation,
    fetchUnreadMessagesNotifications,
    user,
    routeParams.userId,
    routeParams.isEditable,
    routeParams,
  ]);

  const handleLeaveRoom = useCallback(async () => {
    if (!routeParams.isEditable) {
      return;
    }

    const newRooms = rooms.filter(room => room.room.id !== roomId);

    setRooms(newRooms);
    await api.put(`/rooms/${roomId}/owner`);
  }, [roomId, rooms, routeParams.isEditable]);

  return (
    <>
      <Modal
        ref={deleteRoomModalRef}
        icon="log-out"
        description="Tem certeza que deseja sair dessa sala?"
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
          data={rooms}
          contentContainerStyle={{
            marginTop: 16,
          }}
          renderItem={({ item, index }: any) => {
            if (index && (index + 1) % 6 === 0) {
              return (
                <>
                  <UserRoomCard
                    onLongPress={() => {
                      if (routeParams.isEditable) {
                        setRoomId(item.room.id);
                        deleteRoomModalRef.current?.handleModalOpen();
                      }
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
                    if (routeParams.isEditable) {
                      setRoomId(item.room.id);
                      deleteRoomModalRef.current?.handleModalOpen();
                    }
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
            if (user) {
              if (routeParams.isEditable) {
                return (
                  <Description>Você não tem nenhuma sala criada</Description>
                );
              } else {
                return (
                  <Description>
                    Este usuário não tem nenhuma sala criada
                  </Description>
                );
              }
            } else {
              return null;
            }
          }}
        />

        <EmptyStateWrapper>
          {!routeParams.userId && <LoginEmptyState type="room" />}
        </EmptyStateWrapper>
      </Container>
    </>
  );
}

export default UserRooms;
