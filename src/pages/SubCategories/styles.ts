import { FlatList } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  background: ${props => props.theme.colors.background};
  height: 100%;
  padding-top: 25px;
  padding-bottom: 25px;
`;

export const Title = styled.Text`
  font-family: 'Robot-Regular';
  font-size: 24px;
  color: ${props => props.theme.colors.text};
  margin-left: 40px;
  margin-bottom: 34px;
`;

export const ScrollView = styled(FlatList as new () => FlatList)``;

export const Description = styled.Text`
  font-family: 'Roboto-Regular';
  color: ${props => props.theme.colors.textSecundary};
  font-size: 16px;
`;
