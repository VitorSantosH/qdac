import Icon from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  border-bottom-color: ${props => props.theme.colors.lineSeparator};
  border-bottom-width: 1px;
  margin-bottom: 15px;
  padding: 0 33px 0 33px;
`;

export const Description = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 12px;
  color: ${props => props.theme.colors.textSecundary};
  margin-bottom: 10px;
`;

export const Title = styled.Text`
  width: 50%;

  font-family: 'Roboto-Medium';
  font-size: 18px;
  color: ${props => props.theme.colors.text};
`;

export const QuestionTitle = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 7px;
  width: 524px;
`;

export const UsersView = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 16px;
`;

export const UsersIcon = styled(Icon)`
  margin-left: 4px;
`;

export const UnreadMessagesBadge = styled.Text`
  font-family: 'Roboto-Medium';
  font-size: 18px;
  color: ${props => props.theme.colors.text};

  text-align: center;

  border-radius: 400px;
  width: 30px;
  height: 30px;
  margin-left: 12px;
  background-color: red;
`;
