import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from 'styled-components';

import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { ForgotPassword } from './ForgotPassword';
import { ForgotPasswordToken } from './ForgotPasswordToken';

import { useAuthModal } from '../../hooks/auth.modal';

import { Container, ScrollView } from './styles';

export type AuthType =
  | 'sign-in'
  | 'sign-up'
  | 'forgot-password'
  | 'forgot-password-token';

type AuthModalProps = {
  authType: AuthType | null;
  isVisible: boolean;
};

export function AuthModal({ authType, isVisible }: AuthModalProps) {
  const { colors } = useTheme();
  const { handleCloseModal } = useAuthModal();

  if (!authType) {
    return null;
  }

  return (
    <Modal visible={isVisible} animationType="fade">
      <Container behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            flex: 1,
            alignSelf: 'stretch',
          }}>
          <ScrollView
            contentContainerStyle={{
              marginTop: 16,
            }}>
            <TouchableOpacity
              onPress={handleCloseModal}
              style={{
                alignItems: 'flex-end',
                marginTop: 18,
                marginRight: 18,
              }}>
              <Icon name="x" color={colors.primary} size={28} />
            </TouchableOpacity>
            <AuthComponent authType={authType} />
          </ScrollView>
        </KeyboardAvoidingView>
      </Container>
    </Modal>
  );
}

const AuthComponent = ({ authType }: Omit<AuthModalProps, 'isVisible'>) => {
  switch (authType) {
    case 'sign-in':
      return <SignIn />;
    case 'sign-up':
      return <SignUp />;
    case 'forgot-password':
      return <ForgotPassword />;
    case 'forgot-password-token':
      return <ForgotPasswordToken />;
    default:
      return null;
  }
};
