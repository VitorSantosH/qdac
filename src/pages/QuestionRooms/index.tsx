import { useNavigation, useRoute } from '@react-navigation/core';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Alert, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import RoomCard from '../../components/RoomCard';
import { useAuth } from '../../hooks/auth';
import { useAuthModal } from '../../hooks/auth.modal';
import api from '../../services/api';

import { Modal, ModalHandles } from '../../components/Modal';

import {
  Container,
  Title,
  ScrollView,
  Description,
  Button,
  CategoryText,
} from './styles';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';

interface IRouteParams {
  question_id: string;
  title: string;
  category: string;
  subCategory: string;
}

interface RoomData {
  created_at: string;
  description: string | null;
  id: string;
  name: string;
  owner: {
    avatar: null | string;
    id: string;
    name: string;
  };
  owner_id: string;
  participants_count: number;
}

interface IUser {
  id: string;
}

function QuestionRooms() {
  const navigation = useNavigation();
  const route = useRoute();
  const { handleOpenModal } = useAuthModal();

  const createRoomModalRef = useRef<ModalHandles>(null);
  const unauthenticatedUserModalRef = useRef<ModalHandles>(null);
  const deleteRoomModalRef = useRef<ModalHandles>(null);

  const routeParams = route.params as IRouteParams;

  const auth = useAuth();
  const user = auth.user as IUser;

  const [rooms, setRooms] = useState<RoomData[]>();
  const [roomId, setRoomId] = useState('');

  const handleAddRoom = useCallback(async () => {
    if (!user) {
      handleOpenModal('sign-in');
    }

    const { data } = await api.get(
      `/questions/${routeParams.question_id}/rooms`,
    );
    const roomsCount = data.length;

    try {
      const room = await api.post('/rooms', {
        name: `Sala ${roomsCount + 1}`,
        owner_id: user?.id,
        question_id: routeParams.question_id,
      });

      await api.post('/rooms/participants', {
        user_id: user?.id,
        room_id: room.data.id,
      });

      navigation.navigate('Chat', {
        id: room.data.id,
        question: routeParams.title,
        title: room.data.name,
        category: routeParams.category,
        subCategory: routeParams.subCategory,
        users: 1,
      });
    } catch (err: any) {
      console.error(err);
      throw new Error(err);
    }
  }, [
    user,
    routeParams.question_id,
    routeParams.title,
    routeParams.category,
    routeParams.subCategory,
    handleOpenModal,
    navigation,
  ]);

  const handleCreateNewRoom = useCallback(async () => {
    if (!user) {
      handleOpenModal('sign-in');
    }

    try {
      if (rooms?.length === 0) {
        await handleAddRoom();
        return;
      }

      const thisQuestionRatedTheMaximumParticipants = rooms?.find(
        room => room.participants_count >= 100,
      );

      if (!thisQuestionRatedTheMaximumParticipants) {
        throw new Error(
          'User only can create a room if all rooms rated the maximum participants length.',
        );
      }

      await handleAddRoom();
    } catch (err) {
      console.error(err);
      Alert.alert(
        'Erro ao criar sala',
        'Não foi possível criar a sala, pois você já tem uma sala criada e ela não está cheia.',
      );
    }
  }, [handleAddRoom, handleOpenModal, rooms, user]);

  async function handleDeleteRoom() {
    const newRooms = rooms?.filter(room => room.id !== roomId);

    setRooms(newRooms);
    await api.delete(`/rooms/${roomId}`);
  }

  useEffect(() => {
    const loadRooms = navigation.addListener('focus', async () => {
      const { data } = await api.get(
        `/questions/${routeParams.question_id}/rooms`,
      );

      setRooms(data);
    });

    return loadRooms;
  }, [routeParams.question_id, navigation]);

  return (
    <>
      <Modal
        ref={createRoomModalRef}
        icon="edit"
        description="Tem certeza que quer criar uma nova sala?"
        footerContentStyles={{
          flexDirection: 'row',
        }}
        footer={({ handleModalClose }) => [
          {
            label: 'Sim',
            variant: 'solid',
            onPress: async () => {
              await handleCreateNewRoom();
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
        description="Para criar uma sala, entre com sua conta!"
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

      <Modal
        ref={deleteRoomModalRef}
        icon="trash"
        description="Tem certeza que quer excluir essa sala?"
        footerContentStyles={{
          flexDirection: 'row',
        }}
        footer={({ handleModalClose }) => [
          {
            label: 'Sim',
            variant: 'solid',
            onPress: async () => {
              await handleDeleteRoom();
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

      <View style={{ backgroundColor: '#fffd00' }}>
        <Container>
          <ScrollView
            keyExtractor={(item: any) => item.id}
            data={rooms}
            ListHeaderComponent={() => {
              return (
                <>
                  <BannerAd
                    unitId={
                      process.env.NODE_ENV === 'development'
                        ? TestIds.BANNER
                        : 'ca-app-pub-4182205118133604/8035381112'
                    }
                    size={BannerAdSize.SMART_BANNER}
                    requestOptions={{ requestNonPersonalizedAdsOnly: true }}
                  />
                  <CategoryText>{`${routeParams.category} > ${routeParams.subCategory}`}</CategoryText>
                  <Title>{routeParams.title}</Title>
                </>
              );
            }}
            renderItem={({ item, index }: any) => {
              if (index && (index + 1) % 6 === 0) {
                return (
                  <>
                    <RoomCard
                      onLongPress={() => {
                        if (!user) {
                          return;
                        }

                        if (user?.id === item.owner.id) {
                          setRoomId(item.id);
                          deleteRoomModalRef.current?.handleModalOpen();
                        }
                      }}
                      id={item.id}
                      title={item.name}
                      owner={item.owner.name}
                      users={item.participants_count}
                      question={routeParams.title}
                      category={routeParams.category}
                      subCategory={routeParams.subCategory}
                      description={item.description}
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
                  <RoomCard
                    onLongPress={() => {
                      if (!user) {
                        return;
                      }

                      if (user?.id === item.owner.id) {
                        setRoomId(item.id);
                        deleteRoomModalRef.current?.handleModalOpen();
                      }
                    }}
                    id={item.id}
                    title={item.name}
                    owner={item.owner.name}
                    users={item.participants_count}
                    question={routeParams.title}
                    category={routeParams.category}
                    subCategory={routeParams.subCategory}
                    description={item.description}
                  />
                );
              }
            }}
            ListEmptyComponent={() => (
              <Description>Não há salas no momento</Description>
            )}
          />
        </Container>
      </View>

      <Button
        onPress={() => {
          if (!user) {
            unauthenticatedUserModalRef.current?.handleModalOpen();

            return;
          }

          createRoomModalRef.current?.handleModalOpen();
        }}>
        <Icon name="plus" size={30} color="#000" />
      </Button>
    </>
  );
}

export default QuestionRooms;
