import React, { useCallback, useContext, useRef, useState } from 'react';
import Input from '../../Input';
import { Alert, ActivityIndicator, View } from 'react-native';
import { ThemeContext } from 'styled-components';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  ForgotPasswordButton,
  ForgotPasswordText,
} from './styles';

interface SignInFormData {
  email: string;
}

export function ForgotPassword() {
  const { colors } = useContext(ThemeContext);
  const formRef = useRef<FormHandles>(null);
  const { handleOpenModal } = useAuthModal();

  const [loading, setLoading] = useState(false);

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um E-mail válido'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setLoading(true);

        await api.post('/password/forgot', {
          email: data.email,
        });

        setLoading(false);

        Alert.alert(
          'E-mail de recuperação enviado',
          'Enviamos um e-mail para confirmar a recuperação de senha, cheque sua caixa de entrada',
        );

        handleOpenModal('forgot-password-token');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        console.log(err);

        Alert.alert(
          'Erro no envio de e-mail',
          'Ocorreu um erro ao enviar um e-mail, verifique seu e-mail e tente novamente',
        );
      } finally {
        setLoading(false);
      }
    },
    [handleOpenModal],
  );

  return (
    <Container>
      <Title>Recuperar senha</Title>
      <Text>Coloque seu e-mail abaixo para recuperar sua senha.</Text>

      <Form ref={formRef} onSubmit={handleSignIn}>
        <Input
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="email-address"
          name="email"
          icon="mail"
          placeholder="E-mail"
          returnKeyType="done"
          onSubmitEditing={() => {
            formRef.current?.submitForm();
          }}
        />
      </Form>
      <Footer>
        <ForgotPasswordButton onPress={() => handleOpenModal('sign-in')}>
          <View style={{ flexDirection: 'row' }}>
            <Icon name="login" size={20} color={colors.text} />
            <ForgotPasswordText>Voltar ao login</ForgotPasswordText>
          </View>
        </ForgotPasswordButton>

        <Button onPress={() => formRef.current?.submitForm()}>
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <BottomButtonText>Enviar E-mail</BottomButtonText>
          )}
        </Button>
      </Footer>
    </Container>
  );
}
