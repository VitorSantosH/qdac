import React, { useCallback, useRef, useState } from 'react';
import { Alert, ActivityIndicator, ToastAndroid } from 'react-native';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import * as Yup from 'yup';

import Input from '../../components/Input';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useAuth } from '../../hooks/auth';

import {
  Container,
  Title,
  Text,
  Button,
  Footer,
  BottomButtonText,
} from './styles';

interface ChangeUserNameData {
  username: string;
}

export function ChangeUsername() {
  const formRef = useRef<FormHandles>(null);
  const { updateUsername } = useAuth();

  const [loading, setLoading] = useState(false);

  const handleChangeUsername = useCallback(
    async (data: ChangeUserNameData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          username: Yup.string().required('Nome de usuário é obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setLoading(true);

        await api.put('/profile/change-username', {
          username: data.username,
        });
        await updateUsername(data.username);

        setLoading(false);

        ToastAndroid.showWithGravity(
          'Nome de usuário adicionado com sucesso!',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        console.error(err);

        Alert.alert(
          'Erro ao adicionar nome de usuário',
          'Esse nome já esta sendo usado',
        );
      } finally {
        setLoading(false);
      }
    },
    [updateUsername],
  );

  return (
    <Container>
      <Title>Adicionar nome de usuário</Title>
      <Text>Coloque seu nome de usuário abaixo.</Text>

      <Form ref={formRef} onSubmit={handleChangeUsername}>
        <Input
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="default"
          name="username"
          icon="user"
          placeholder="Nome de usuário"
          returnKeyType="done"
          onSubmitEditing={() => {
            formRef.current?.submitForm();
          }}
        />
      </Form>
      <Footer>
        <Button onPress={() => formRef.current?.submitForm()}>
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <BottomButtonText>Continuar</BottomButtonText>
          )}
        </Button>
      </Footer>
    </Container>
  );
}
