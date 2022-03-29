import React, { ReactNode } from 'react';

import { Linking, Text } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import { useTheme } from 'styled-components';

import {
  TopicItem,
  TopicItemDescription,
  TopicItemText,
} from '../Settings/styles';

import { Container } from './styles';

function AboutQandac() {
  const { colors } = useTheme();

  return (
    <Container>
      <TopicItem onPress={() => Linking.openURL('https://qandac.com/termos/')}>
        <TopicItemText>Termos de Serviço</TopicItemText>

        <Icon name="chevron-right" size={20} color={colors.textSecundary} />
      </TopicItem>

      <TopicItem
        onPress={() => Linking.openURL('https://qandac.com/privacidade/')}>
        <TopicItemText>Política de Privacidade</TopicItemText>

        <Icon name="chevron-right" size={20} color={colors.textSecundary} />
      </TopicItem>

      <TopicItem>
        <TopicItemText>Versão da aplicação</TopicItemText>

        <TopicItemDescription>versão 5.0.0</TopicItemDescription>
      </TopicItem>
    </Container>
  );
}

export default AboutQandac;
