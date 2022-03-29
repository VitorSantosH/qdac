import { useNavigation } from '@react-navigation/core';
import React, { useCallback, useRef, useState } from 'react';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import {
  ActivityIndicator,
  Alert,
  TextInput,
  View,
  Switch,
  Linking,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import Input from '../../components/Input';

import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

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
  ScrollView,
  Content,
} from './styles';

import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}
function useForceUpdate(): () => void {
  return React.useReducer(() => ({}), {})[1] as () => void; // <- paste here
}

function SignUp() {
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();
  const nameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const [isAcceptTerms, setIsAcceptTerms] = useState(false);

  const forceUpdate = useForceUpdate();
  const [loading, setLoading] = useState(false);

  function handleGoSignIn() {
    navigation.navigate('SignIn');
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
        setLoading(true);
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
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
        setLoading(false);
        navigation.navigate('SignIn');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          setLoading(false);

          return;
        }

        Alert.alert(
          'Erro ao criar a conta',
          'E-mail ou Nome de usuário já está em uso',
        );

        setLoading(false);
      }
    },
    [navigation],
  );

  if (loading) {
    return (
      <ActivityIndicator
        size="small"
        color="#fff"
        style={{ position: 'absolute', top: '50%', left: '50%' }}
      />
    );
  }

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
            <Title>Crie sua conta</Title>
            <Text>
              Crie uma conta e participe agora de discussões sobre diversos
              temas.
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
              <DescriptionButton onPress={handleGoSignIn}>
                <ButtonText>Entrar</ButtonText>
              </DescriptionButton>
            </DescriptionContainer>
            <Button
              disabled={!isAcceptTerms}
              onPress={() => formRef.current?.submitForm()}>
              <BottomButtonText>Registrar</BottomButtonText>
            </Button>
          </ScrollView>
        </Content>
      </KeyboardAvoidingView>
    </Container>
  );
}

export default SignUp;
