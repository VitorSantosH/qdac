import { FlatList } from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  background: ${props => props.theme.colors.background};
  height: 100%;
  padding-bottom: 20px;
`;

export const Title = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Roboto-Regular';
  font-size: 24px;
  margin: 20px 0 20px 25px;
`;

export const PostsContainer = styled.View``;

export const ScrollView = styled(FlatList as new () => FlatList)`
  flex-grow: 1;
  margin-bottom: 60px;
`;

export const SeparatorList = styled.View`
  width: 100%;
  height: 0.5px;
  background-color: ${props => props.theme.colors.text};
  opacity: 0.5;
`;

export const LoadMoreQuestionContainer = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;

  margin-top: -32px;
  margin-bottom: 26px;
`;
