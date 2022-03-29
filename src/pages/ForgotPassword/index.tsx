import {useNavigation} from '@react-navigation/core';
import React, {useCallback, useContext, useRef, useState} from 'react';
import Input from '../../components/Input';
import {Alert, ActivityIndicator} from 'react-native';

import {Form} from '@unform/mobile';
import {FormHandles} from '@unform/core';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as Yup from 'yup';

import {
  Container,
  Title,
  Text,
  Button,
  BottomButtonText,
  ForgotPasswordButton,
  ForgotPasswordText,
} from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import {ThemeContext} from 'styled-components';

interface SignInFormData {
  email: string;
}
function ForgotPassword() {
  const {colors} = useContext(ThemeContext);
  const formRef = useRef<FormHandles>(null);
  const navigation = useNavigation();

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

        navigation.navigate('ForgotPasswordToken');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro no envio de e-mail',
          'Ocorreu um erro ao enviar um e-mail, verifique seu e-mail e tente novamente',
        );
      }
    },
    [navigation],
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

      <ForgotPasswordButton onPress={() => navigation.navigate('SignIn')}>
        <Icon name="login" size={20} color={colors.text} />
        <ForgotPasswordText>Voltar ao login</ForgotPasswordText>
      </ForgotPasswordButton>

      <Button onPress={() => formRef.current?.submitForm()}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <BottomButtonText>Enviar E-mail</BottomButtonText>
        )}
      </Button>
    </Container>
  );
}

export default ForgotPassword;
