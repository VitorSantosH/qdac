import React from 'react';

import {
  Container,
  Title,
  TitleButton,
  TitleButtonText,
  Wrapper,
} from './styles';

import { useAuthModal } from '../../hooks/auth.modal';

interface LoginEmptyStateProps {
  type: string;
}

function LoginEmptyState({ type }: LoginEmptyStateProps) {
  const { handleOpenModal } = useAuthModal();

  return (
    <Container>
      {type === 'question' ? (
        <Wrapper>
          <Title>Para criar ou ver suas perguntas, faça</Title>
          <TitleButton onPress={() => handleOpenModal('sign-in')}>
            <TitleButtonText>Login</TitleButtonText>
          </TitleButton>
          <Title>ou</Title>
          <TitleButton onPress={() => handleOpenModal('sign-up')}>
            <TitleButtonText>Crie uma conta</TitleButtonText>
          </TitleButton>
        </Wrapper>
      ) : (
        <Title>
          <Wrapper>
            <Title>Para criar ou ver salas, faça</Title>
            <TitleButton onPress={() => handleOpenModal('sign-in')}>
              <TitleButtonText>Login</TitleButtonText>
            </TitleButton>
            <Title>ou</Title>
            <TitleButton onPress={() => handleOpenModal('sign-up')}>
              <TitleButtonText>Crie uma conta</TitleButtonText>
            </TitleButton>
          </Wrapper>
        </Title>
      )}
    </Container>
  );
}

export default LoginEmptyState;
