import React, { useCallback, useRef } from 'react';

import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Input from '../../components/Input';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import { Container, Title, Button, Description, HelpText } from './styles';
import api from '../../services/api';
import { useNavigation, useRoute } from '@react-navigation/core';
import { useAuth } from '../../hooks/auth';
import { ScrollView } from 'react-native-gesture-handler';

interface IQuestionData {
  question: string;
}

interface IRouteParams {
  sub_category_id: string;
}

function AddQuestion() {
  const formRef = useRef<FormHandles>(null);

  const { user } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as IRouteParams;

  const handleAddQuestion = useCallback(
    async ({ question }: IQuestionData) => {
      let arrayquestion = question.split(' ');
      if (arrayquestion.length < 3) {
        Alert.alert(
          'Erro na Pergunta!',
          'Digite uma pergunta com mais de 2 Palavras!',
        );
        return;
      }
      if (question.length > 220) {
        Alert.alert(
          'Limite de 220 caracteres',
          'Voce passou do limite de 220 caracteres.',
        );

        return;
      } else {
        try {
          const questionAlreadyExists = await api.post('/questions/title', {
            title: question,
          });

          if (questionAlreadyExists.data) {
            Alert.alert(
              'Não foi possível criar uma nova pergunta',
              'Não é possível criar uma pergunta já feita',
            );

            return;
          }

          await api.post('/questions', {
            title: question,
            sub_category_id: routeParams.sub_category_id,
            created_by: user?.id,
          });
          navigation.navigate('Questions');
        } catch (err) {
          Alert.alert(
            'Não foi possível criar uma nova pergunta',
            'Não é possível criar uma outra pergunta se voce já criou uma a 10 minutos atrás',
          );
        }
      }
    },

    [routeParams.sub_category_id, navigation, user?.id],
  );

  return (
    <Container>
      <ScrollView>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Title>Qual a sua pergunta?</Title>
          <Form ref={formRef} onSubmit={handleAddQuestion}>
            <Input
              name="question"
              icon="help-circle"
              placeholder="Digite aqui sua pergunta..."
              returnKeyType="send"
              multiline
              onSubmitEditing={() => formRef.current?.submitForm()}
              autoFocus
              containerStyle={styles.containerStyle}
            />
          </Form>

          <Description>Limite de 220 caracteres</Description>

          <>
            <HelpText>Verifique bem a gramática e a ortografia</HelpText>
            <HelpText>
              Mantenha a sua pergunta curta e vá direto ao ponto
            </HelpText>
            <HelpText>
              Certifique-se de que a sua pergunta não foi feita anteriormente{' '}
            </HelpText>
          </>
        </KeyboardAvoidingView>
      </ScrollView>
      <Button onPress={() => formRef.current?.submitForm()}>
        <Icon name="check" size={30} color="#000" />
      </Button>
    </Container>
  );
}
const styles = {
  containerStyle: {
    height: 100,
  },
};

export default AddQuestion;
