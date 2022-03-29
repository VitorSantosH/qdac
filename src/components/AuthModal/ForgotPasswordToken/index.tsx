import React, { useCallback, useContext, useRef } from 'react';
import Input from '../../Input';
import { Alert, TextInput, View } from 'react-native';
import { ThemeContext } from 'styled-components';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import * as Yup from 'yup';

import getValidationErrors from '../../../utils/getValidationErrors';
import api from '../../../services/api';
import { useAuthModal } from '../../../hooks/auth.modal';

import {
  Container,
  Title,
  Text,
  Button,
  Footer,
  BottomButtonText,
  ForgotPassword,
  ForgotPasswordText,
} from './styles';

interface SignInFormData {
  token: string;
  password: string;
}

export function ForgotPasswordToken() {
  const { colors } = useContext(ThemeContext);
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const { handleOpenModal } = useAuthModal();

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          token: Yup.string()
            .required('Chave obrigatória')
            .uuid('Formato da chave inválida'),
          password: Yup.string()
            .required('Senha obrigatória')
            .min(6, 'No mínimo 6 dígitos'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/reset', {
          password: data.password,
          token: data.token,
        });

        Alert.alert('Senha alterada com sucesso!');

        handleOpenModal('sign-in');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro na recuperação',
          'Ocorreu um erro ao fazer a recuperação de senha, cheque as credenciais',
        );
      }
    },
    [handleOpenModal],
  );

  return (
    <Container>
      <Title>Recuperar senha</Title>
      <Text>Coloque a chave recebida por e-mail e a sua nova senha.</Text>

      <Form ref={formRef} onSubmit={handleSignIn}>
        <Input
          autoCorrect={false}
          autoCapitalize="none"
          name="token"
          icon="key"
          placeholder="Chave"
          returnKeyType="next"
          onSubmitEditing={() => {
            passwordInputRef.current?.focus();
          }}
        />
        <Input
          ref={passwordInputRef}
          secureTextEntry
          name="password"
          icon="lock"
          placeholder="Nova Senha"
          returnKeyType="send"
          onSubmitEditing={() => formRef.current?.submitForm()}
        />
      </Form>

      <Footer>
        <ForgotPassword onPress={() => handleOpenModal('sign-in')}>
          <View style={{ flexDirection: 'row' }}>
            <Icon name="login" size={20} color={colors.text} />
            <ForgotPasswordText>Voltar ao login</ForgotPasswordText>
          </View>
        </ForgotPassword>

        <Button onPress={() => formRef.current?.submitForm()}>
          <BottomButtonText>Recuperar</BottomButtonText>
        </Button>
      </Footer>
    </Container>
  );
}
