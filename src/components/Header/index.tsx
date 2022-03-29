import {
  AdEventType,
  InterstitialAd,
  TestIds,
  firebase,
} from '@react-native-firebase/admob';
import { useNavigation } from '@react-navigation/core';
import React, { useCallback, useContext } from 'react';

import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from 'styled-components/native';
import { firebaseConfig } from '../../../firebase';

import {
  Container,
  Title,
  TextView,
  Description,
  UsersView,
  UsersText,
} from './styles';

interface HeaderProps {
  title: string;
  category: string;
  subCategory: string;
  users: string;
  question: string;
  isChat?: boolean;
  description?: string;
  id?: string;
}

function Header({
  title,
  category,
  subCategory,
  users,
  question,
  isChat = true,
  description,
  id,
}: HeaderProps) {
  const navigation = useNavigation();
  const { colors } = useContext(ThemeContext);

  const showInterstitialAd = useCallback(() => {
    firebase.initializeApp(firebaseConfig);

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

  return (
    <Container>
      <TouchableOpacity
        onPress={() => {
          if (isChat) {
            showInterstitialAd();
          } else {
            navigation.goBack();
          }
        }}>
        <Icon name="chevron-left" size={35} color={`${colors.text}`} />
      </TouchableOpacity>

      <TextView>
        <Title>{title}</Title>
        <Description
          numberOfLines={
            1
          }>{`${category} > ${subCategory} > ${question}`}</Description>
      </TextView>

      <UsersView
        onPress={() => {
          if (isChat) {
            navigation.navigate('RoomInfo', {
              title,
              category,
              subCategory,
              users,
              question,
              description,
              id,
            });
          }
        }}>
        <UsersText>{users} / 100</UsersText>
        <Icon name="users" size={25} color={`${colors.text}`} />
      </UsersView>
    </Container>
  );
}

export default Header;
