import React, { useEffect, useState, useCallback } from 'react';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import { useNavigation } from '@react-navigation/core';
import {
  View,
  ToastAndroid,
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components';

import Post from '../../components/Post';
import api from '../../services/api';

import {
  Container,
  Title,
  PostsContainer,
  LoadMoreQuestionContainer,
} from './styles';

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

const renderListItem = (item: Question, index: number) => {
  if (index && (index + 1) % 6 === 0) {
    return (
      <>
        <Post
          id={item.id}
          title={item.title}
          categoryName={item.sub_category.category.name}
          subCategoryName={item.sub_category.name}
          categoryId={item.sub_category.category.id}
          subCategoryId={item.sub_category.id}
          created_by={item.created_by}
          createdAt={item.created_at}
          user={item.user}
          rooms={item.rooms}
        />

        <BannerAd
          unitId={
            process.env.NODE_ENV === 'development'
              ? TestIds.BANNER
              : 'ca-app-pub-4182205118133604/8035381112'
          }
          size={BannerAdSize.SMART_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </>
    );
  } else {
    return (
      <Post
        id={item.id}
        title={item.title}
        categoryName={item.sub_category.category.name}
        subCategoryName={item.sub_category.name}
        categoryId={item.sub_category.category.id}
        subCategoryId={item.sub_category.id}
        created_by={item.created_by}
        createdAt={item.created_at}
        user={item.user}
        rooms={item.rooms}
      />
    );
  }
};

function Home() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsNotDeleted, setQuestionsNotDeleted] = useState<Question[]>(
    [],
  );
  const [currentQuestionsPage, setCurrentQuestionsPage] = useState(1);
  const [isTheLastPage, setIsTheLastPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadQuestions = useCallback(async () => {
    const isNotTheFirstPage = currentQuestionsPage > 1;

    if (!isLoading) {
      setIsLoading(true);
    }

    try {
      const { data } = await api.get<Question[]>(
        `/questions?_page=${currentQuestionsPage}`,
      );

      if (data.length === 0 && isNotTheFirstPage) {
        ToastAndroid.showWithGravity(
          'Não há mais perguntas.',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );

        setIsTheLastPage(true);
        return;
      }

      const filteredData = data.filter(question => !question.is_removed);

      if (isNotTheFirstPage) {
        setQuestions(oldState => [...oldState, ...data]);
        setQuestionsNotDeleted(oldState => [...oldState, ...filteredData]);
        return;
      }

      setQuestions(data);
      setQuestionsNotDeleted(filteredData);
    } catch (err) {
      console.error(err);
      Alert.alert('Algo deu errado, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [currentQuestionsPage, isLoading]);

  useEffect(() => {
    return navigation.addListener('focus', async () => loadQuestions());
  }, [navigation, loadQuestions]);

  function onLoadMoreQuestions() {
    if (isTheLastPage) {
      return;
    }

    setCurrentQuestionsPage(oldState => oldState + 1);
    loadQuestions();
  }

  const questionsNotDeletedAmount = questionsNotDeleted.length;

  const windowSize =
    questionsNotDeletedAmount > 50 ? questionsNotDeletedAmount / 4 : 25;

  return (
    <SafeAreaView>
      <View style={{ backgroundColor: colors.primary }}>
        <Container>
          <Title>Perguntas do momento</Title>

          {questionsNotDeleted.length === 0 && isLoading && (
            <ActivityIndicator size={32} color={colors.primary} />
          )}
          <PostsContainer>
            {questionsNotDeleted.length > 0 && (
              <FlatList
                style={{ marginBottom: 24 }}
                maxToRenderPerBatch={windowSize}
                windowSize={windowSize}
                keyExtractor={question => question.id}
                data={questionsNotDeleted}
                extraData={questionsNotDeleted}
                ListFooterComponentStyle={{
                  marginVertical: 6,
                }}
                onEndReachedThreshold={0.5}
                onEndReached={onLoadMoreQuestions}
                renderItem={({ index, item }) => renderListItem(item, index)}
                ListFooterComponent={() => {
                  if (isTheLastPage) {
                    return (
                      <LoadMoreQuestionContainer>
                        <Text style={{ color: colors.primary }}>
                          Não há mais perguntas
                        </Text>
                      </LoadMoreQuestionContainer>
                    );
                  }

                  if (isLoading) {
                    return (
                      <LoadMoreQuestionContainer>
                        <ActivityIndicator size={32} color={colors.primary} />
                      </LoadMoreQuestionContainer>
                    );
                  }

                  return null;
                }}
              />
            )}
          </PostsContainer>
        </Container>
      </View>
    </SafeAreaView>
  );
}

export default Home;
