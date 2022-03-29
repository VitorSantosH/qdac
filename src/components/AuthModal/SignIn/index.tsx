import React, { useCallback, useRef, useState } from 'react';
import Input from '../../Input';
import {
  ActivityIndicator,
  Alert,
  TextInput,
  ToastAndroid,
} from 'react-native';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import * as Yup from 'yup';

import getValidationErrors from '../../../utils/getValidationErrors';
import { useAuth } from '../../../hooks/auth';
import { useAuthModal } from '../../../hooks/auth.modal';

import { FacebookButton } from '../../Social/FacebookButton';

import {
  Container,
  Title,
  Text,
  DescriptionContainer,
  Description,
  DescriptionButton,
  ButtonText,
  Button,
  BottomButtonText,
  ForgotPassword,
  ForgotPasswordText,
} from './styles';
import { GoogleButton } from '../../Social/GoogleButton';

interface SignInFormData {
  email: string;
  password: string;
}

type Loading = {
  facebook?: boolean;
  google?: boolean;
  default?: boolean;
};

function SignIn() {
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const { handleOpenModal, handleCloseModal } = useAuthModal();

  const { signIn, signWithFacebook, signWithGoogle } = useAuth();

  const [isLoading, setIsLoading] = useState<Loading>({
    facebook: false,
    google: false,
    default: false,
  });

  async function handleSignInWithFacebook() {
    setIsLoading({
      facebook: true,
    });

    try {
      await signWithFacebook();
      handleCloseModal();
      ToastAndroid.showWithGravity(
        'Logado com sucesso!',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    } catch (err: any) {
      console.error(err);

      ToastAndroid.showWithGravity(
        'Algo deu errado, tente novamente.',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    } finally {
      setIsLoading({
        facebook: false,
      });
    }
  }

  async function handleSignInWithGoogle() {
    setIsLoading({
      google: true,
    });

    try {
      await signWithGoogle();
      handleCloseModal();
      ToastAndroid.showWithGravity(
        'Logado com sucesso!',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM,
      );
    } catch (erro: any) {
      if (
        (erro.response !== undefined || erro.response.data !== null) &&
        erro.response.data
      ) {
        ToastAndroid.showWithGravity(
          erro.response.data.message,
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      } else {
        ToastAndroid.showWithGravity(
          'Algo deu errado, tente novamente.',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      }
    } finally {
      setIsLoading({
        google: false,
      });
    }
  }

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      setIsLoading({
        default: true,
      });

      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um E-mail válido'),
          password: Yup.string().required('Senha obrigatória'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
        });

        handleCloseModal();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro na autenticação',
          'Ocorreu um erro ao fazer login, cheque as credenciais',
        );
      } finally {
        setIsLoading({
          default: false,
        });
      }
    },
    [signIn, handleCloseModal],
  );

  return (
    <Container>
      <Title>Entrar</Title>
      <Text>Faça login na sua conta.</Text>

      <Form ref={formRef} onSubmit={handleSignIn}>
        <Input
          autoCorrect={false}
          autoCapitalize="none"
          keyboardType="email-address"
          name="email"
          icon="mail"
          placeholder="E-mail"
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
          placeholder="Senha"
          returnKeyType="send"
          onSubmitEditing={() => formRef.current?.submitForm()}
        />
      </Form>

      <DescriptionContainer>
        <Description>Não tem uma conta?</Description>
        <DescriptionButton onPress={() => handleOpenModal('sign-up')}>
          <ButtonText>Registrar-se</ButtonText>
        </DescriptionButton>
      </DescriptionContainer>
      <ForgotPassword onPress={() => handleOpenModal('forgot-password')}>
        <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
      </ForgotPassword>

      <Button onPress={() => formRef.current?.submitForm()}>
        <BottomButtonText>
          {isLoading.default ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            'Entrar'
          )}
        </BottomButtonText>
      </Button>
      <FacebookButton
        onPress={handleSignInWithFacebook}
        isLoading={isLoading.facebook}
      />
      <GoogleButton
        onPress={handleSignInWithGoogle}
        isLoading={isLoading.google}
      />
    </Container>
  );
}

export { SignIn };
