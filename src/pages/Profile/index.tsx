import React, {
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

import { ScrollView, Alert, Modal } from 'react-native';
import * as Yup from 'yup';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';

import Input from '../../components/Input';
import { TextInput } from 'react-native';

import {
  Container,
  Button,
  ButtonText,
  ModalButton,
  ModalButtonText,
  ModalButtonsView,
  ModalDescription,
  ModalOverlay,
  ModalView,
} from './styles';
import { useNavigation } from '@react-navigation/core';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import { useAuth } from '../../hooks/auth';
import { ThemeContext } from 'styled-components';
import Icon from 'react-native-vector-icons/Feather';

interface ProfileProps {
  children: ReactNode;
}

interface SignUpFormData {
  name: string;
  username: string;
  email: string;
  password: string;
  old_password: string;
  password_confirmation: string;
}

function Profile({ }: ProfileProps) {
  const { colors } = useContext(ThemeContext);

  const { user, updateUser, signOut } = useAuth();
  const navigation = useNavigation();

  const formRef = useRef<FormHandles>(null);

  const emailInputRef = useRef<TextInput>(null);
  const usernameInputRef = useRef<TextInput>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const [modalOpen, setModalOpen] = useState(false);

  const handleSignUp = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          username: Yup.string().required('Nome de usuário é obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), null], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
          username,
        } = data;

        const formData = {
          name,
          username,
          email,
          ...(old_password
            ? {
              old_password,
              password,
              password_confirmation,
            }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        Alert.alert('Perfil atualizado com sucesso!');

        navigation.goBack();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro na atualização do perfil',
          'E-mail ou nome de usuário já está em uso',
        );
      }
    },
    [updateUser, navigation],
  );

  const handleDeleteAccount = useCallback(async () => {
    await api.post(
      'https://us6.api.mailchimp.com/3.0/lists/8a3f1b95b1',
      {
        members: [
          {
            email_address: user?.email,
            status: 'unsubscribed',
          },
        ],
        update_existing: true,
      },
      {
        headers: {
          Authorization: 'auth f5ac0399764f86c57406df0726b8ee90-us6',
        },
      },
    );

    await api.delete(`/users/${user?.id}`);

    navigation.navigate('Home');

    signOut();
  }, [navigation, user?.email, user?.id, signOut]);

  return (
    <>
      <Modal visible={modalOpen} animationType="fade" transparent>
        <ModalOverlay>
          <ModalView>
            <Icon name="alert-triangle" size={71} color={colors.primary} />
            <ModalDescription>
              Tem certeza que quer excluir sua conta? Essa ação não poderá ser
              desfeita!
            </ModalDescription>
            <ModalButtonsView>
              <ModalButton isFilled onPress={handleDeleteAccount}>
                <ModalButtonText isFilled>Sim</ModalButtonText>
              </ModalButton>

              <ModalButton onPress={() => setModalOpen(false)}>
                <ModalButtonText>Não</ModalButtonText>
              </ModalButton>
            </ModalButtonsView>
          </ModalView>
        </ModalOverlay>
      </Modal>

      <ScrollView style={{ flex: 1 }}>
        <Container>
          <Form initialData={user || {}} ref={formRef} onSubmit={handleSignUp}>
            <Input
              ref={emailInputRef}
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              name="email"
              icon="mail"
              placeholder="E-mail"
              returnKeyType="next"
              onSubmitEditing={() => oldPasswordInputRef.current?.focus()}
              initialValue={user?.email}
            />
            <Input
              ref={usernameInputRef}
              keyboardType="default"
              autoCorrect={false}
              autoCapitalize="none"
              name="username"
              icon="user"
              placeholder="E-mail"
              returnKeyType="next"
              onSubmitEditing={() => usernameInputRef.current?.focus()}
              initialValue={user?.email}
            />
            <Input
              ref={oldPasswordInputRef}
              secureTextEntry
              name="old_password"
              icon="lock"
              placeholder="Senha atual"
              textContentType="newPassword"
              returnKeyType="next"
              containerStyle={{ marginTop: 16 }}
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />
            <Input
              ref={passwordInputRef}
              secureTextEntry
              name="password"
              icon="lock"
              placeholder="Nova senha"
              textContentType="newPassword"
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
            />
            <Input
              ref={confirmPasswordInputRef}
              secureTextEntry
              name="password_confirmation"
              icon="lock"
              placeholder="Confirmar senha"
              textContentType="newPassword"
              returnKeyType="send"
              onSubmitEditing={() => formRef.current?.submitForm()}
            />
          </Form>

          <Button onPress={() => formRef.current?.submitForm()}>
            <ButtonText>Confirmar mudanças</ButtonText>
          </Button>

          <Button onPress={() => setModalOpen(true)} outlined>
            <ButtonText>Apagar conta</ButtonText>
          </Button>
        </Container>
      </ScrollView>
    </>
  );
}

export default Profile;
