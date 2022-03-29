import {FlatList} from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  height: 100%;
  background: ${props => props.theme.colors.background};
`;

export const Header = styled.View`
  height: 74px;
  border-bottom-color: ${props => props.theme.colors.secundary};
  border-bottom-width: 1px;
  padding: 0 30px;

  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
`;

export const Title = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 18px;
  color: ${props => props.theme.colors.text};
`;

export const CenterView = styled.View`
  height: 80%;

  align-items: center;
  justify-content: center;
`;

export const Content = styled.View`
  align-items: center;
`;

export const Description = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 24px;
  color: ${props => props.theme.colors.textSecundary};
`;

export const ScrollView = styled(FlatList as new () => FlatList)``;
