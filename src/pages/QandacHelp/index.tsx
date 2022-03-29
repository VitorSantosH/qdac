import React from 'react';
import { Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from 'styled-components';
import { TopicItem, TopicItemText } from '../Settings/styles';

import { Container } from './styles';

function QandacHelp() {
  const { colors } = useTheme();

  return (
    <Container>
      <TopicItem onPress={() => Linking.openURL('https://qandac.com/contato')}>
        <TopicItemText>Relatar um problema</TopicItemText>
        <Icon name="chevron-right" size={20} color={colors.textSecundary} />
      </TopicItem>
      <TopicItem onPress={() => Linking.openURL('https://qandac.com')}>
        <TopicItemText>Central de ajuda</TopicItemText>
        <Icon name="chevron-right" size={20} color={colors.textSecundary} />
      </TopicItem>
    </Container>
  );
}

export default QandacHelp;
