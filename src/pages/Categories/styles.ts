import { FlatList } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  background: ${props => props.theme.colors.background};
  height: 100%;
  display: flex;
  justify-content: center;
`;

export const ScrollView = styled(FlatList as new () => FlatList)``;

export const Description = styled.Text`
  font-family: 'Roboto-Regular';
  color: ${props => props.theme.colors.textSecundary};
  font-size: 16px;
  margin-top: 15px;
`;
