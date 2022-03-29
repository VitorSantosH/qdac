import React, { useContext } from 'react';
import { Switch } from 'react-native-gesture-handler';
import { ThemeContext } from 'styled-components';
import { ToggleThemeContext } from '../../hooks/theme';
import { Container, Section, SectionText } from './styles';

export function Appearance() {
  const { toggleTheme } = useContext(ToggleThemeContext);
  const { title } = useContext(ThemeContext);

  return (
    <Container>
      <Section>
        <SectionText>Modo escuro</SectionText>
        <Switch
          onValueChange={toggleTheme}
          value={title === 'dark'}
          trackColor={{ true: '#555', false: '#ddd' }}
          thumbColor={title === 'dark' ? '#000' : '#555'}
        />
      </Section>
    </Container>
  );
}
