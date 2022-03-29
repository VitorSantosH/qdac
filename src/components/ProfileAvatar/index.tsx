import React from 'react';
import { Image, ImageProps } from 'react-native';

interface ProfileAvatarProps extends Omit<ImageProps, 'source'> {
  user_avatar: string | null | undefined;
}

export function ProfileAvatar({ user_avatar, ...rest }: ProfileAvatarProps) {
  return (
    <Image
      {...rest}
      source={{
        uri: user_avatar
          ? `https://qandac.herokuapp.com/files/${user_avatar}`
          : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png',
      }}
    />
  );
}
