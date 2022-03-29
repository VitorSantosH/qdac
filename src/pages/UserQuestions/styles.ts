import { FlatList } from 'react-native';
import styled from 'styled-components/native';

interface ButtonProps {
  red?: boolean;
}

export const Container = styled.View`
  background: ${props => props.theme.colors.background};
  flex: 1;
`;

export const Title = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Roboto-Regular';
  font-size: 24px;
  margin-bottom: 25px;
  margin-left: 40px;
  margin-top: 30px;
`;

export const Description = styled.Text`
  font-family: 'Roboto-Regular';
  color: ${props => props.theme.colors.textSecundary};
  font-size: 16px;
  margin-top: 15px;
  text-align: center;
`;

export const ScrollView = styled(FlatList as new () => FlatList)`
  flex-grow: 1;
`;

export const PostContainer = styled.TouchableOpacity`
  border-bottom-color: ${props => props.theme.colors.lineSeparator};
  border-bottom-width: 1px;
  padding-bottom: 18px;
  margin-top: 12px;
  padding: 0 30px 0 30px;
`;

export const CategoriesView = styled.View``;

export const CategoryText = styled.Text`
  color: ${props => props.theme.colors.textSecundary};
  font-family: 'Roboto-Regular';
  font-size: 12px;
  margin-bottom: 11px;
`;

export const QuestionView = styled.View`
  height: 70px;
  flex-direction: row;
  justify-content: space-between;
`;

export const QuestionText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Roboto-Medium';
  font-size: 18px;
  width: 270px;
`;

export const Circle = styled.TouchableOpacity<ButtonProps>`
  position: absolute;
  right: ${props => (props.red ? '40px' : '0px')};
  height: 30px;
  width: 30px;
  border-radius: 15px;
  background: ${props =>
    props.red ? props.theme.colors.error : props.theme.colors.primary};

  align-items: center;
  justify-content: center;
`;

export const SearchContainer = styled.View`
  padding: 25px 30px 0 30px;
`;

export const InputContainer = styled.View`
  height: 45px;
  background: ${props => props.theme.colors.inputBackground};

  flex-direction: row;
  align-items: center;
`;

export const TextInput = styled.TextInput`
  color: ${props => props.theme.colors.text};
  width: 80%;
  padding-left: 14px;
`;

export const EmptyStateWrapper = styled.View`
  position: absolute;
  top: 50%;
  align-self: center;
`;
