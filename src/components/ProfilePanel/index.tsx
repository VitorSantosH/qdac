import React from 'react';
import { useNavigation } from '@react-navigation/core';

import Icon from 'react-native-vector-icons/Feather';

import { ProfileAvatar } from '../ProfileAvatar';

import {
  Container,
  Content,
  UserName,
  ViewProfile,
  ProfileName,
  ProfileInfo,
} from './styles';
import { useAuth } from '../../hooks/auth';
import { useTheme } from 'styled-components';

interface ProfilePanelProps {
  user_avatar: string | null | undefined;
  user_name: string | undefined;
}

export function ProfilePanel({ user_avatar, user_name }: ProfilePanelProps) {
  const navigation = useNavigation();

  const { user } = useAuth();
  const { colors } = useTheme();

  return (
    <Container
      onPress={() =>
        navigation.navigate('Account', {
          isEditable: true,
          userName: user?.name,
          userAvatar: user?.avatar,
          userId: user?.id,
        })
      }>
      <Content>
        <ProfileInfo>
          <ProfileAvatar
            style={{
              width: 52,
              height: 52,
              borderRadius: 9999,
            }}
            user_avatar={user_avatar}
          />
          <ProfileName>
            <UserName>{user_name}</UserName>
            <ViewProfile>Ver perfil</ViewProfile>
          </ProfileName>
        </ProfileInfo>

        <Icon name="chevron-right" size={36} color={colors.textSecundary} />
      </Content>
    </Container>
  );
}
