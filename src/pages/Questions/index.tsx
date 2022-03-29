/* eslint-disable react/jsx-no-undef */
import { useNavigation, useRoute } from '@react-navigation/core';
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';

import { FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import api from '../../services/api';

import { Modal, ModalHandles } from '../../components/Modal';

import {
  Container,
  Title,
  Description,
  Button,
  InputContainer,
  TextInput,
  QuestionsContainer,
  SearchContainer,
} from './styles';

import { ThemeContext } from 'styled-components';
import { useAuth } from '../../hooks/auth';
import { useAuthModal } from '../../hooks/auth.modal';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import Post from '../../components/Post';

interface IRouteParams {
  category_id: string;
  category: string;
  sub_category: string;
}

interface Question {
  id: string;
  title: string;
  created_by: string;
  is_removed: boolean;
  sub_category: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    };
  };
  created_at: Date;
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

function Questions() {
  const deleteQuestionModalRef = useRef<ModalHandles>(null);
  const createQuestionModalRef = useRef<ModalHandles>(null);
  const { colors } = useContext(ThemeContext);
  const { user } = useAuth();
  const { handleOpenModal } = useAuthModal();

  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as IRouteParams;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentQuestionId, setCurrentQuestionId] = useState('');

  const handleDeleteQuestion = useCallback(async () => {
    await api.delete(`/questions/${currentQuestionId}`);

    let newQuestions = questions;

    newQuestions = newQuestions.filter(
      question => question.id !== currentQuestionId,
    );

    setQuestions(newQuestions);
  }, [currentQuestionId, questions]);

  const handleSearch = useCallback(async () => {
    const questionsInSubCategories = await api.get(
      `/sub-categories/${routeParams.category_id}/questions`,
      { params: { search: inputValue } },
    );

    setQuestions(
      questionsInSubCategories.data.filter(question => !question.is_removed),
    );
  }, [inputValue, routeParams.category_id]);

  useEffect(() => {
    const loadQuestions = navigation.addListener('focus', async () => {
      const { data } = await api.get(
        `/sub-categories/${routeParams.category_id}/questions`,
      );
      setQuestions(data.filter(question => !question.is_removed));
    });

    return loadQuestions;
  }, [routeParams.category_id, navigation, routeParams]);

  return (
    <>
      <Modal
        ref={deleteQuestionModalRef}
        description="Tem certeza que quer excluir essa pergunta?"
        footerContentStyles={{
          flexDirection: 'row',
        }}
        footer={({ handleModalClose }) => [
          {
            label: 'Sim',
            variant: 'solid',
            onPress: async () => {
              await handleDeleteQuestion();
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
        ref={createQuestionModalRef}
        description="Para criar uma pergunta, entre com sua conta!"
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

      <Container>
        <Title>
          {routeParams.sub_category != null
            ? `${routeParams.category} > ${routeParams.sub_category}`
            : routeParams.category}
        </Title>

        <QuestionsContainer>
          <FlatList
            style={{
              backgroundColor: colors.background,
              marginBottom: 75,
            }}
            ListHeaderComponent={() => (
              <SearchContainer>
                <InputContainer>
                  <Icon
                    name="search"
                    size={20}
                    color={colors.textSecundary}
                    style={{
                      paddingLeft: 14,
                    }}
                  />

                  <TextInput
                    placeholder="Busque uma pergunta"
                    placeholderTextColor={colors.textSecundary}
                    value={inputValue}
                    onChangeText={setInputValue}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                  />
                </InputContainer>
              </SearchContainer>
            )}
            data={questions}
            keyExtractor={question => question.id}
            ListEmptyComponent={() => (
              <Description>Não há Perguntas no momento</Description>
            )}
            renderItem={({ item: question, index }) => {
              if (!question.is_removed) {
                if (index && (index + 1) % 6 === 0) {
                  return (
                    <>
                      <Post
                        categoryId={routeParams.category_id}
                        subCategoryId={question.sub_category.id}
                        categoryName={routeParams.category}
                        subCategoryName={routeParams.sub_category}
                        created_by={question.created_by}
                        title={question.title}
                        id={question.id}
                        createdAt={question.created_at}
                        rooms={question.rooms}
                        user={question.user}
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
                    <Post
                      categoryId={routeParams.category_id}
                      subCategoryId={question.sub_category.id}
                      categoryName={routeParams.category}
                      subCategoryName={routeParams.sub_category}
                      created_by={question.created_by}
                      title={question.title}
                      id={question.id}
                      createdAt={question.created_at}
                      rooms={question.rooms}
                      user={question.user}
                    />
                  );
                }
              } else {
                return null;
              }
            }}
          />
        </QuestionsContainer>
      </Container>

      <Button
        onPress={() => {
          if (!user) {
            createQuestionModalRef.current?.handleModalOpen();
            return;
          }

          navigation.navigate('AddQuestion', {
            sub_category_id: routeParams.category_id,
          });
        }}>
        <Icon name="plus" size={30} color="#000" />
      </Button>
    </>
  );
}

export default Questions;
