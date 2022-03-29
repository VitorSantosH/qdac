import { useNavigation } from '@react-navigation/core';
import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from 'styled-components';

import {
  PostContainer,
  CategoriesView,
  CategoryText,
  QuestionView,
  QuestionText,
  QuestionRoomsWrapper,
  QuestionRooms,
  QuestionRoomsView,
  CategoryTextView,
  UserText,
  CreatedAtText,
} from './styles';

import { formatDateToString } from '../../utils/dateUtils';

interface PostProps {
  categoryName: string;
  subCategoryName: string;
  title: string;
  id: string;
  categoryId: string;
  subCategoryId: string;
  created_by: string;
  createdAt: Date;
  rooms: {
    id: string;
    name: string;
  }[];
  user: {
    id: string;
    name: string;
    username: string | undefined;
    avatar: string;
  };
}

function Post({
  categoryName,
  subCategoryName,
  title,
  id,
  categoryId,
  subCategoryId,
  createdAt,
  rooms,
  user,
}: PostProps) {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const createdAtString = formatDateToString(createdAt);

  return (
    <PostContainer
      onPress={() =>
        navigation.navigate('Categories', {
          screen: 'QuestionRooms',
          params: {
            question_id: id,
            title,
            isHome: true,
            category: categoryName,
            subCategory: subCategoryName,
            categoryId,
            subCategoryId,
          },
          initial: false,
        })
      }>
      <CategoriesView>
        <CategoryTextView>
          <UserText
            onPress={() => {
              navigation.navigate('Account', {
                isEditable: false,
                userName: user.name,
                userAvatar: user.avatar,
                userId: user.id,
              });
            }}>
            <CategoryText>
              {user?.username ? `@${user.username}` : user.name}
            </CategoryText>
          </UserText>
          <CategoryText>{` • ${categoryName} > ${subCategoryName}`}</CategoryText>
        </CategoryTextView>

        <QuestionView>
          <QuestionText numberOfLines={3}>{title}</QuestionText>

          <QuestionRoomsView>
            <CreatedAtText>{createdAtString}</CreatedAtText>
            <QuestionRoomsWrapper>
              <QuestionRooms numberOfLines={3}>{rooms.length}</QuestionRooms>
              <Icon name="message-square" color={colors.textSecundary} />
            </QuestionRoomsWrapper>
          </QuestionRoomsView>
        </QuestionView>
      </CategoriesView>
    </PostContainer>
  );
}

export default Post;
