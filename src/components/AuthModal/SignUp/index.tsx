/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  TextInput,
  View,
  Switch,
  Linking,
  ToastAndroid,
} from 'react-native';

import Input from '../../Input';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import * as Yup from 'yup';

import getValidationErrors from '../../../utils/getValidationErrors';
import api from '../../../services/api';

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
} from './styles';
import { useAuth } from '../../../hooks/auth';
import { GoogleButton } from '../../Social/GoogleButton';

interface SignUpFormData {
  name: string;
  username: string;
  email: string;
  password: string;
}

function useForceUpdate(): () => void {
  return React.useReducer(() => ({}), {})[1] as () => void; // <- paste here
}

type Loading = {
  facebook?: boolean;
  google?: boolean;
  default?: boolean;
};

function SignUp() {
  const formRef = useRef<FormHandles>(null);
  const nameInputRef = useRef<TextInput>(null);
  const usernameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const [isAcceptTerms, setIsAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState<Loading>({
    facebook: false,
    google: false,
    default: false,
  });
  const { handleOpenModal, handleCloseModal } = useAuthModal();
  const { signWithFacebook, signUpWithGoogle } = useAuth();

  const forceUpdate = useForceUpdate();

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

  async function handleSignUpWithGoogle() {
    setIsLoading({
      google: true,
    });

    try {
      await signUpWithGoogle();
      handleCloseModal();
      ToastAndroid.showWithGravity(
        'Criado com sucesso!',
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

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      if (data.name == '') {
        Alert.alert(
          'Erro de Validação',
          'Digite alguma informação no campo de nome',
        );
        return;
      }
      if (data.username == '') {
        Alert.alert(
          'Erro de Validação',
          'Digite alguma informação no campo de nome de usuário',
        );
        return;
      }
      if (data.email == '') {
        Alert.alert(
          'Erro de Validação',
          'Digite alguma informação no campo de email',
        );
        return;
      }
      if (data.password == '') {
        Alert.alert(
          'Erro de Validação',
          'Digite alguma informação no campo de senha',
        );
        return;
      }

      try {
        setIsLoading({
          default: true,
        });
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          username: Yup.string().required('Nome de usuário obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um E-mail válido'),
          password: Yup.string()
            .required('Senha obrigatória')
            .min(6, 'No mínimo 6 dígitos'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        await api.post(
          'https://us6.api.mailchimp.com/3.0/lists/8a3f1b95b1',
          {
            members: [
              {
                email_address: data.email,
                status: 'subscribed',
              },
            ],
          },
          {
            headers: {
              Authorization: 'auth f5ac0399764f86c57406df0726b8ee90-us6',
            },
          },
        );

        Alert.alert(
          'Cadastro realizado com sucesso!',
          'Voce já pode fazer login na aplicação.',
        );

        handleOpenModal('sign-in');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro ao criar a conta',
          'E-mail ou Nome de usuário já está em uso',
        );
      } finally {
        setIsLoading({
          default: false,
        });
      }
    },
    [handleOpenModal],
  );

  return (
    <Container>
      <Title>Crie sua conta</Title>
      <Text>
        Crie uma conta e participe agora de discussões sobre diversos temas.
      </Text>

      <Form ref={formRef} onSubmit={handleSignUp}>
        <Input
          ref={nameInputRef}
          autoCapitalize="words"
          name="name"
          icon="user"
          placeholder="Nome"
          returnKeyType="next"
          onSubmitEditing={() => emailInputRef.current?.focus()}
        />
        <Input
          ref={usernameInputRef}
          autoCapitalize="words"
          name="username"
          icon="user"
          placeholder="Nome de usuário"
          returnKeyType="next"
          onSubmitEditing={() => usernameInputRef.current?.focus()}
        />
        <Input
          ref={emailInputRef}
          keyboardType="email-address"
          autoCorrect={false}
          autoCapitalize="none"
          name="email"
          icon="mail"
          placeholder="E-mail"
          returnKeyType="next"
          onSubmitEditing={() => passwordInputRef.current?.focus()}
        />
        <Input
          ref={passwordInputRef}
          secureTextEntry
          name="password"
          icon="lock"
          placeholder="Senha"
          textContentType="newPassword"
          returnKeyType="send"
          onSubmitEditing={() => formRef.current?.submitForm()}
        />

        <View
          style={{
            width: '90%',
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}>
          <Switch
            trackColor={{ false: '#767577', true: '#343443' }}
            thumbColor={isAcceptTerms ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            value={isAcceptTerms}
            onValueChange={e => {
              setIsAcceptTerms(e);
              forceUpdate();
            }}
          />
          <Text style={{ color: '#838288', height: 80 }}>
            Você aceita nossa{' '}
            <Text
              onPress={() => {
                Linking.openURL('https://qandac.com/privacidade');
              }}>
              Política de Privacidade
            </Text>{' '}
            e nossos{' '}
            <Text
              onPress={() => {
                Linking.openURL('https://qandac.com/termos');
              }}>
              Termos de Serviço
            </Text>{' '}
            ao criar uma conta!
          </Text>
        </View>
      </Form>

      <DescriptionContainer>
        <Description>Já tem uma conta?</Description>
        <DescriptionButton onPress={() => handleOpenModal('sign-in')}>
          <ButtonText>Entrar</ButtonText>
        </DescriptionButton>
      </DescriptionContainer>
      <Button
        disabled={!isAcceptTerms}
        onPress={() => formRef.current?.submitForm()}>
        <BottomButtonText>
          {isLoading.default ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            'Registrar'
          )}
        </BottomButtonText>
      </Button>

      <FacebookButton
        onPress={handleSignInWithFacebook}
        isLoading={isLoading.facebook}
      />

      <GoogleButton
        onPress={handleSignUpWithGoogle}
        isLoading={isLoading.google}
      />
    </Container>
  );
}

export { SignUp };
