import { useNavigation } from '@react-navigation/core';
import React, { useCallback, useRef, useState } from 'react';
import Input from '../../components/Input';
import {
  ActivityIndicator,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import * as Yup from 'yup';

import {
  Container,
  Content,
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
  ScrollView,
} from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';

interface SignInFormData {
  email: string;
  password: string;
}
function SignIn() {
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  const { signIn } = useAuth();

  const [loading, setLoading] = useState(false);

  function handleGoSignUp() {
    navigation.navigate('SignUp');
  }

  const handleSignIn = useCallback(
    async (data: SignInFormData) => {
      setLoading(true);

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

        setLoading(false);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          setLoading(false);

          return;
        }

        Alert.alert(
          'Erro na autenticação',
          'Ocorreu um erro ao fazer login, cheque as credenciais',
        );

        setLoading(false);
      }
    },
    [signIn],
  );

  return (
    <Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          flex: 1,
          alignSelf: 'stretch',
        }}>
        <Content
          style={{
            maxWidth: 272,
            width: wp('100%'),
          }}>
          <ScrollView
            contentContainerStyle={{
              marginTop: 16,
            }}>
            <Title>Entrar</Title>
            <Text>Bem vindo de volta! Nós sentimos a sua falta.</Text>

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
              <DescriptionButton onPress={handleGoSignUp}>
                <ButtonText>Registrar-se</ButtonText>
              </DescriptionButton>
            </DescriptionContainer>
            <ForgotPassword
              onPress={() => navigation.navigate('ForgotPassword')}>
              <ForgotPasswordText>Esqueci minha senha</ForgotPasswordText>
            </ForgotPassword>

            <Button onPress={() => formRef.current?.submitForm()}>
              <BottomButtonText>
                {loading ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  'Entrar'
                )}
              </BottomButtonText>
            </Button>
          </ScrollView>
        </Content>
      </KeyboardAvoidingView>
    </Container>
  );
}

export default SignIn;
