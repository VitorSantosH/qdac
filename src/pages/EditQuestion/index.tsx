import React, { useCallback, useRef } from 'react';

import { Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Input from '../../components/Input';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import { Container, Title, Button, Description } from './styles';
import api from '../../services/api';
import { useNavigation, useRoute } from '@react-navigation/core';

interface IQuestionData {
  question: string;
}

interface IRouteParams {
  id: string;
  title: string;
}

function EditQuestion() {
  const formRef = useRef<FormHandles>(null);

  const navigation = useNavigation();
  const route = useRoute();
  const routeParams = route.params as IRouteParams;

  const handleAddQuestion = useCallback(
    async ({ question }: IQuestionData) => {
      if (question.length > 220) {
        Alert.alert(
          'Limite de 220 caracteres',
          'Voce passou do limite de 220 caracteres.',
        );

        return;
      } else {
        try {
          await api.put(`/questions/${routeParams.id}`, {
            title: question,
          });

          navigation.goBack();
        } catch {
          Alert.alert(
            'Não foi possível criar uma nova pergunta',
            'Não é possível criar uma pergunta já feita',
          );
        }
      }
    },

    [navigation, routeParams.id],
  );

  return (
    <>
      <Container>
        <Title>Editar pergunta</Title>
        <Form ref={formRef} onSubmit={handleAddQuestion}>
          <Input
            name="question"
            icon="message-square"
            placeholder="Digite aqui sua pergunta..."
            returnKeyType="send"
            onSubmitEditing={() => formRef.current?.submitForm()}
            initialValue={routeParams.title}
            autoFocus
          />
        </Form>

        <Description>Limite de 220 caracteres</Description>
      </Container>

      <Button onPress={() => formRef.current?.submitForm()}>
        <Icon name="check" size={30} color="#000" />
      </Button>
    </>
  );
}

export default EditQuestion;
