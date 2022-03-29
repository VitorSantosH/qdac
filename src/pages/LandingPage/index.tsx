import { useNavigation } from '@react-navigation/core';
import React from 'react';

import logoImg from '../../../public/images/logo.png';

import {
  Container,
  WellcomeText,
  Image,
  ButtonContainer,
  Button,
  ButtonText,
} from './styles';

function LandingPage() {
  const navigation = useNavigation();

  function handleGoSignUp() {
    navigation.navigate('SignUp');
  }

  function handleGoSignIn() {
    navigation.navigate('SignIn');
  }

  return (
    <>
      <Container>
        <Image source={logoImg} />
        <WellcomeText>
          Bem vindo ao Qandac! Entre com a sua conta ou crie uma nova para
          discutir sobre temas de seu interesse.
        </WellcomeText>
      </Container>
      <ButtonContainer>
        <Button onPress={handleGoSignUp} isFilled>
          <ButtonText isFilled>Registrar-se</ButtonText>
        </Button>
        <Button onPress={handleGoSignIn}>
          <ButtonText>Entrar</ButtonText>
        </Button>
      </ButtonContainer>
    </>
  );
}

export default LandingPage;
