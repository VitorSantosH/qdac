import { useNavigation, useRoute } from '@react-navigation/core';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { RectButton } from 'react-native-gesture-handler';

import { Modal, Text, Alert, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from 'styled-components';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import firebase from '../../services/firebaseApi';

import {
  Container,
  ScrollView,
  DescriptionView,
  Title,
  EditButton,
  Description,
  Divider,
  AdminText,
  AdminView,
  Button,
  ButtonText,
  ButtonsView,
  ModalDescription,
  ModalOverlay,
  ModalView,
  RemoveUserButton,
  UserImage,
  UserInfoContainer,
  UserName,
  UserView,
} from './styles';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';

interface IRouteParams {
  description: string | null;
  title: string;
  category: string;
  subCategory: string;
  users: string;
  question: string;
  id: string;
}

interface User {
  id: string;
  name: string;
  avatar: string;
}

function RoomInfo() {
  const { colors } = useContext(ThemeContext);

  const route = useRoute();
  const routeParams = route.params as IRouteParams;
  const navigation = useNavigation();
  const { user } = useAuth();

  const [description, setDescription] = useState(
    routeParams.description ? routeParams.description : '',
  );
  const [ownerId, setOwnerId] = useState('');
  const [usersInRoom, setUsersInRoom] = useState<User[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');

  const currentUserIsOwner = ownerId === user?.id;

  const handleModalYes = useCallback(async () => {
    await api.delete(`/rooms/${routeParams.id}/participants/${currentUserId}`);

    const newUsersInRoom = usersInRoom.filter(
      userInRoom => userInRoom.id !== currentUserId,
    );
    setUsersInRoom(newUsersInRoom);

    firebase.removeMessage(currentUserId, routeParams.id);

    setModalOpen(false);
  }, [currentUserId, routeParams.id, usersInRoom]);

  const handleModalNo = useCallback(() => {
    setModalOpen(false);
  }, []);

  async function handleLeaveRoom() {
    const alertDescription = currentUserIsOwner
      ? `Deseja sair da sala ${routeParams.title}? A administração vai ficar para outro membro da sala`
      : `Deseja sair da sala ${routeParams.title}?`;

    return Alert.alert(
      'Sair da Sala',
      alertDescription,
      [
        {
          text: 'Cancelar',
        },
        {
          text: 'Sim',
          onPress: async () => {
            try {
              if (currentUserIsOwner) {
                await api.put(`/rooms/${routeParams.id}/owner`);
              } else {
                await api.delete(
                  `/rooms/${routeParams.id}/participants/${user?.id}`,
                );
              }

              navigation.navigate('Home');
            } catch (err) {
              Alert.alert('Erro!', 'Não foi possível sair da sala');
            }
          },
        },
      ],
      { cancelable: true },
    );
  }

  useEffect(() => {
    const loadRoom = navigation.addListener('focus', async () => {
      const response = await api.get(`/rooms/${routeParams.id}`);
      setDescription(response.data.description);
      setOwnerId(response.data.owner_id);

      const { data } = await api.get(`/rooms/${routeParams.id}/participants`);
      const parsedUsers = data.map(user => user?.user);
      setUsersInRoom(parsedUsers);
    });

    return loadRoom;
  }, [routeParams.id, description, navigation]);

  return (
    <>
      <Modal visible={modalOpen} animationType="fade" transparent>
        <ModalOverlay>
          <ModalView>
            <Icon name="trash" size={71} color={colors.primary} />
            <ModalDescription>
              Tem certeza que quer expulsar esse usuário?
            </ModalDescription>
            <ButtonsView>
              <Button isFilled onPress={handleModalYes}>
                <ButtonText isFilled>Sim</ButtonText>
              </Button>

              <Button onPress={handleModalNo}>
                <ButtonText>Não</ButtonText>
              </Button>
            </ButtonsView>
          </ModalView>
        </ModalOverlay>
      </Modal>

      <Container>
        <View style={{ alignItems: 'center' }}>
          <BannerAd
            unitId={
              process.env.NODE_ENV === 'development'
                ? TestIds.BANNER
                : 'ca-app-pub-4182205118133604/8035381112'
            }
            size={BannerAdSize.SMART_BANNER}
            requestOptions={{ requestNonPersonalizedAdsOnly: true }}
          />
        </View>
        <ScrollView>
          <DescriptionView>
            <Title>Descrição:</Title>
            {user?.id === ownerId && (
              <EditButton
                onPress={() =>
                  navigation.navigate('EditDescription', {
                    title: routeParams.title,
                    category: routeParams.category,
                    subCategory: routeParams.subCategory,
                    users: routeParams.users,
                    question: routeParams.question,
                    description: description,
                    id: routeParams.id,
                  })
                }>
                <Text style={{ color: '#000', fontSize: 12 }}>Editar</Text>
              </EditButton>
            )}
          </DescriptionView>

          {description ? (
            <Description>{description}</Description>
          ) : (
            <Description>Sem descrição</Description>
          )}

          <Divider />

          {usersInRoom.map(userInRoom => (
            <UserInfoContainer key={userInRoom.id}>
              <UserView>
                <UserImage
                  source={{
                    uri: userInRoom.avatar
                      ? `https://qandac.herokuapp.com/files/${userInRoom.avatar}`
                      : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
                  }}
                />
                <UserName>{userInRoom.name}</UserName>
              </UserView>

              {userInRoom.id === ownerId ? (
                <AdminView>
                  <AdminText>admin.</AdminText>
                </AdminView>
              ) : (
                user?.id === ownerId && (
                  <RemoveUserButton
                    onPress={() => {
                      setCurrentUserId(userInRoom.id);
                      setModalOpen(true);
                    }}>
                    <Icon name="trash" size={20} color="#D32F2F" />
                  </RemoveUserButton>
                )
              )}
            </UserInfoContainer>
          ))}
          <RectButton
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: 64,
              marginVertical: 8,
            }}
            onPress={handleLeaveRoom}>
            <Text
              style={{ color: '#d24747', fontSize: 18, fontWeight: 'bold' }}>
              Sair da sala
            </Text>
          </RectButton>
        </ScrollView>
      </Container>
    </>
  );
}

export default RoomInfo;
