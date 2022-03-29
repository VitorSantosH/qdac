import { useNavigation, useRoute } from '@react-navigation/core';
import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useContext,
} from 'react';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import Icon from 'react-native-vector-icons/Feather';

import { Modal, ModalHandles } from '../../components/Modal';

import {
  Container,
  ScrollView,
  CategoriesView,
  CategoryText,
  PostContainer,
  QuestionText,
  QuestionView,
  Circle,
  Description,
  SearchContainer,
  InputContainer,
  TextInput,
  EmptyStateWrapper,
} from './styles';
import { ThemeContext } from 'styled-components';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import LoginEmptyState from '../../components/LoginEmptyState';

interface IRouteParams {
  isProfile: boolean | undefined;
  userId: string;
  isEditable: boolean;
}

function UserQuestions() {
  const { colors } = useContext(ThemeContext);
  const { user } = useAuth();
  const route = useRoute();
  const { isProfile, userId, isEditable } = route.params as IRouteParams;

  const deleteQuestionModalRef = useRef<ModalHandles>(null);
  const navigation = useNavigation();

  const [userQuestions, setUserQuestions] = useState<any>([]);
  const [filteredUserQuestions, setFilteredUserQuestions] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState('');
  const [inputValue, setInputValue] = useState('');

  const handleDeleteQuestion = useCallback(async () => {
    if (!isEditable) {
      return;
    }

    await api.delete(`/questions/${currentQuestionId}`);

    let newQuestions: any = userQuestions;

    newQuestions = newQuestions.filter(
      question => question.id !== currentQuestionId,
    );

    setUserQuestions(newQuestions);
  }, [currentQuestionId, userQuestions, isEditable]);

  const handleSearch = useCallback(
    async text => {
      const userQuestionsSearch = userQuestions.filter(question => {
        return question.title.toLowerCase().includes(text);
      });

      setFilteredUserQuestions(userQuestionsSearch);
      setInputValue(text);
    },
    [userQuestions],
  );

  useEffect(() => {
    const loadUserQuestions = navigation.addListener('focus', async () => {
      if (!userId) {
        setUserQuestions([]);
        return;
      }

      const response = await api.get(`/users/${userId}/questions`);

      setUserQuestions(response.data);
      setFilteredUserQuestions(response.data);
    });

    return loadUserQuestions;
  }, [user, navigation, userId]);

  return (
    <>
      <Modal
        ref={deleteQuestionModalRef}
        description="Tem certeza que quer excluir essa pergunta?"
        icon="trash"
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

      <Container>
        <ScrollView
          keyExtractor={item => item.id}
          data={filteredUserQuestions}
          ListHeaderComponent={() => (
            <>
              {!isProfile && userId && (
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
                      onChangeText={handleSearch}
                      returnKeyType="search"
                    />
                  </InputContainer>
                </SearchContainer>
              )}
            </>
          )}
          renderItem={({ item, index }) => {
            if (!item.is_removed) {
              if (index && (index + 1) % 6 === 0) {
                return (
                  <>
                    <PostContainer
                      onPress={() =>
                        navigation.navigate('Categories', {
                          screen: 'QuestionRooms',
                          params: {
                            question_id: item.id,
                            title: item.title,
                            isHome: true,
                            category: item.sub_category.category.name,
                            subCategory: item.sub_category.name,
                            categoryId: item.sub_category.category.id,
                            subCategoryId: item.sub_category.id,
                          },
                          initial: false,
                        })
                      }>
                      <CategoriesView>
                        <CategoryText>{`${item.sub_category.category.name} > ${item.sub_category.name}`}</CategoryText>
                      </CategoriesView>

                      <QuestionView>
                        <QuestionText numberOfLines={5}>
                          {item.title}
                        </QuestionText>

                        {isEditable && (
                          <>
                            <Circle
                              red
                              onPress={() => {
                                setCurrentQuestionId(item.id);
                                deleteQuestionModalRef.current?.handleModalOpen();
                              }}>
                              <Icon name="trash" size={12} color="#000" />
                            </Circle>
                            <Circle
                              onPress={() =>
                                navigation.navigate('Categories', {
                                  screen: 'EditQuestion',
                                  params: {
                                    id: item.id,
                                    title: item.title,
                                  },
                                })
                              }>
                              <Icon name="edit-2" size={12} color="#000" />
                            </Circle>
                          </>
                        )}
                      </QuestionView>
                    </PostContainer>

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
                  <>
                    <PostContainer
                      onPress={() =>
                        navigation.navigate('Categories', {
                          screen: 'QuestionRooms',
                          params: {
                            question_id: item.id,
                            title: item.title,
                            isHome: true,
                            category: item.sub_category.category.name,
                            subCategory: item.sub_category.name,
                            categoryId: item.sub_category.category.id,
                            subCategoryId: item.sub_category.id,
                          },
                          initial: false,
                        })
                      }>
                      <CategoriesView>
                        <CategoryText>{`${item.sub_category.category.name} > ${item.sub_category.name}`}</CategoryText>
                      </CategoriesView>

                      <QuestionView>
                        <QuestionText numberOfLines={5}>
                          {item.title}
                        </QuestionText>

                        {isEditable && (
                          <>
                            <Circle
                              red
                              onPress={() => {
                                setCurrentQuestionId(item.id);
                                deleteQuestionModalRef.current?.handleModalOpen();
                              }}>
                              <Icon name="trash" size={12} color="#000" />
                            </Circle>
                            <Circle
                              onPress={() =>
                                navigation.navigate('Categories', {
                                  screen: 'EditQuestion',
                                  params: {
                                    id: item.id,
                                    title: item.title,
                                  },
                                })
                              }>
                              <Icon name="edit-2" size={12} color="#000" />
                            </Circle>
                          </>
                        )}
                      </QuestionView>
                    </PostContainer>
                  </>
                );
              }
            } else {
              return null;
            }
          }}
          ListEmptyComponent={() => {
            if (!user) {
              return null;
            }

            return (
              <Description>Você não fez nenhuma pergunta ainda</Description>
            );
          }}
        />

        <EmptyStateWrapper>
          {!userId && <LoginEmptyState type="question" />}
        </EmptyStateWrapper>
      </Container>
    </>
  );
}

export default UserQuestions;
