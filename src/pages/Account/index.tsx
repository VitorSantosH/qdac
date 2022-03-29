import React, { useCallback, useRef } from 'react';
import { ProfileAvatar } from '../../components/ProfileAvatar';
import { useAuth } from '../../hooks/auth';
import { ImageView, PhotoButton } from '../Profile/styles';
import { Container, ProfileText, ProfileView } from './styles';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { launchImageLibrary } from 'react-native-image-picker';
import { Alert, TextInput } from 'react-native';
import api from '../../services/api';
import { useTheme } from 'styled-components';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/core';

interface RouteParamsProps {
  isEditable: boolean;
  userName: string;
  userAvatar: string;
}

export function Account() {
  const { user, updateUser } = useAuth();
  const { colors } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const route = useRoute();
  const routeParams = route.params as RouteParamsProps;

  const handleUpdateAvatar = useCallback(() => {
    if (!user) {
      return;
    }

    launchImageLibrary({ mediaType: 'photo', quality: 0.1 }, response => {
      if (response.didCancel) {
        return;
      }

      if (response.errorMessage) {
        Alert.alert(response.errorMessage);
      }

      const data = new FormData();

      data.append('avatar', {
        type: 'image/jpeg',
        name: `${user?.id}.jpg`,
        uri: response.uri,
      });

      api.patch('/users/avatar', data).then(apiResponse => {
        updateUser(apiResponse.data);
      });
    });
  }, [user, updateUser]);

  return (
    <Container>
      <ImageView>
        <ProfileAvatar
          style={{
            height: 175,
            width: 175,
            borderRadius: 87.5,
          }}
          user_avatar={routeParams.userAvatar}
        />
        {routeParams.isEditable && (
          <PhotoButton onPress={handleUpdateAvatar}>
            <FeatherIcon name="camera" size={20} color={`${colors.text}`} />
          </PhotoButton>
        )}
      </ImageView>
      <ProfileView>
        <ProfileText ref={inputRef} editable={false}>
          {routeParams.userName}
        </ProfileText>
        {routeParams.isEditable && (
          <TouchableOpacity
            onPress={() => {
              inputRef.current?.setNativeProps({
                editable: true,
              });
              inputRef.current?.focus();
            }}>
            <FeatherIcon name="edit-2" size={15} color={colors.text} />
          </TouchableOpacity>
        )}
      </ProfileView>
    </Container>
  );
}
