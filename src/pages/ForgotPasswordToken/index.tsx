import {useNavigation} from '@react-navigation/core';
import React, {useCallback, useContext, useRef} from 'react';
import Input from '../../components/Input';
import {Alert, TextInput} from 'react-native';

import {Form} from '@unform/mobile';
import {FormHandles} from '@unform/core';

import * as Yup from 'yup';

import {
  Container,
  Title,
  Text,
  Button,
  BottomButtonText,
  ForgotPassword,
  ForgotPasswordText,
} from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../../services/api';
import {ThemeContext} from 'styled-components';

interface SignInFormData {
  token: string;
  password: string;
}
function ForgotPasswordToken() {
  const {colors} = useContext(ThemeContext);
  const formRef = useRef<FormHandles>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

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

        navigation.navigate('SignIn');
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
    [navigation],
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

      <ForgotPassword onPress={() => navigation.navigate('SignIn')}>
        <Icon name="login" size={20} color={colors.text} />
        <ForgotPasswordText>Voltar ao login</ForgotPasswordText>
      </ForgotPassword>

      <Button onPress={() => formRef.current?.submitForm()}>
        <BottomButtonText>Recuperar</BottomButtonText>
      </Button>
    </Container>
  );
}

export default ForgotPasswordToken;
