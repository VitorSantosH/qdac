import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import Icon from 'react-native-vector-icons/Feather';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import {
  CardContainer,
  QuestionIcon,
  CardTitle,
  Circle,
  QuestionRooms,
  CardHeader,
  CardInfo,
} from './styles';

interface Question {
  id: string;
  title: string;
  created_by: string;
  is_removed: boolean;
}

interface IRouteParams {
  category_id: string;
  category: string;
  sub_category: string;
}

interface CategoriesQuestionsCard {
  question: Question;
  routeParams: IRouteParams;
  handleOnPress: (questionId: string) => void;
}

export function CategoriesQuestionsCard({
  question,
  routeParams,
  handleOnPress,
}: CategoriesQuestionsCard) {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [roomsCount, setRoomsCount] = useState(0);

  useEffect(() => {
    (async function () {
      const { data } = await api.get(`/questions/${question.id}/rooms`);

      setRoomsCount(data.length);
    })();
  }, [question.id]);

  return (
    <CardContainer
      key={question.id}
      onPress={() => {
        navigation.navigate('QuestionRooms', {
          question_id: question.id,
          title: question.title,
          category: routeParams.category,
          subCategory: routeParams.sub_category,
        });
      }}>
      <CardHeader>
        <CardTitle numberOfLines={5}>{question.title}</CardTitle>
        {!!user && user?.id === question.created_by ? (
          <>
            <Circle
              red
              onPress={() => {
                handleOnPress(question.id);
              }}>
              <Icon name="trash" size={12} color="#000" />
            </Circle>
            <Circle
              onPress={() =>
                navigation.navigate('EditQuestion', {
                  id: question.id,
                  title: question.title,
                })
              }>
              <Icon name="edit-2" size={12} color="#000" />
            </Circle>
          </>
        ) : (
          <QuestionIcon name="chevron-right" size={30} color="#fff" />
        )}
      </CardHeader>
      <CardInfo>
        <QuestionRooms>{`${roomsCount} sala(s)`}</QuestionRooms>
      </CardInfo>
    </CardContainer>
  );
}
