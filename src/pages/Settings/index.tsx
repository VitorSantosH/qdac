import { useNavigation } from '@react-navigation/core';
import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { BackHandler, Linking, Modal, ScrollView } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from 'styled-components';
import { useAuth } from '../../hooks/auth';
import { useAuthModal } from '../../hooks/auth.modal';
import api from '../../services/api';

import { ProfilePanel } from '../../components/ProfilePanel';

import {
  Container,
  TopicItem,
  TopicItemText,
  DisconnectButton,
  DisconnectButtonText,
  Button,
  ButtonText,
  ButtonsView,
  ModalDescription,
  ModalOverlay,
  ModalView,
  SignInButton,
  SignInButtonText,
  SignUpButton,
  SignUpButtonText,
  Footer,
} from './styles';
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from '@react-native-firebase/admob';

interface SettingsProps {
  children: ReactNode;
}

function Settings({}: SettingsProps) {
  const { colors } = useContext(ThemeContext);
  const { signOut, user } = useAuth();
  const navigation = useNavigation();
  const { handleOpenModal } = useAuthModal();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const showInterstitialAd = useCallback(() => {
    // firebase.initializeApp(firebaseConfig);

    const interstitialAd = InterstitialAd.createForAdRequest(
      process.env.NODE_ENV === 'development'
        ? TestIds.INTERSTITIAL
        : 'ca-app-pub-4182205118133604/6614133011',
    );

    interstitialAd.onAdEvent((type, error) => {
      if (type === AdEventType.LOADED) {
        interstitialAd.show();
      }
    });

    interstitialAd.load();

    navigation.goBack();

    return true;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = BackHandler.addEventListener(
      'hardwareBackPress',
      showInterstitialAd,
    );

    return () => unsubscribe.remove();
  }, [showInterstitialAd]);

  const handleModalYes = useCallback(async () => {
    if (!user) {
      return;
    }

    setModalOpen(false);

    if (
      modalMessage ===
      'Tem certeza que quer excluir sua conta? Essa ação não poderá ser desfeita!'
    ) {
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

      await api.delete(`/users/${user?.id}`);

      navigation.navigate('Home');

      signOut();
    }
  }, [user, modalMessage, signOut, navigation]);

  const handleModalNo = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <>
      <Modal visible={modalOpen} animationType="fade" transparent>
        <ModalOverlay>
          <ModalView>
            <Icon name="alert-triangle" size={71} color={colors.primary} />
            <ModalDescription>{modalMessage}</ModalDescription>
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
        <ScrollView>
          {user && (
            <>
              <ProfilePanel user_avatar={user?.avatar} user_name={user?.name} />
            </>
          )}
          {user && (
            <TopicItem
              onPress={() => {
                navigation.navigate('Profile');
              }}>
              <TopicItemText>Conta</TopicItemText>
              <Icon
                name="chevron-right"
                size={20}
                color={colors.textSecundary}
              />
            </TopicItem>
          )}
          <TopicItem
            onPress={() => {
              navigation.navigate('CancelNotifications');
            }}>
            <TopicItemText>Notificações</TopicItemText>
            <Icon name="chevron-right" size={20} color={colors.textSecundary} />
          </TopicItem>
          <TopicItem
            onPress={() => {
              navigation.navigate('Appearance');
            }}>
            <TopicItemText>Aparência</TopicItemText>
            <Icon name="chevron-right" size={20} color={colors.textSecundary} />
          </TopicItem>
          <TopicItem onPress={() => navigation.navigate('QandacHelp')}>
            <TopicItemText>Ajuda do Qandac</TopicItemText>
            <Icon name="chevron-right" size={20} color={colors.textSecundary} />
          </TopicItem>
          <TopicItem onPress={() => navigation.navigate('AboutQandac')}>
            <TopicItemText>Sobre o Qandac</TopicItemText>
            <Icon name="chevron-right" size={20} color={colors.textSecundary} />
          </TopicItem>
          <TopicItem
            onPress={() =>
              Linking.openURL(
                'https://play.google.com/store/apps/details?id=com.qandacmobile',
              )
            }>
            <TopicItemText>Avalie o app</TopicItemText>
            <Icon name="chevron-right" size={20} color={colors.textSecundary} />
          </TopicItem>
          <Footer>
            {user ? (
              <DisconnectButton onPress={() => signOut()}>
                <DisconnectButtonText>Desconectar</DisconnectButtonText>
              </DisconnectButton>
            ) : (
              <>
                <SignUpButton onPress={() => handleOpenModal('sign-up')}>
                  <SignUpButtonText>Criar uma conta</SignUpButtonText>
                </SignUpButton>
                <SignInButton onPress={() => handleOpenModal('sign-in')}>
                  <SignInButtonText>Fazer login</SignInButtonText>
                </SignInButton>
              </>
            )}
          </Footer>
        </ScrollView>
      </Container>
    </>
  );
}

export default Settings;
