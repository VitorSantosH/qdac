import styled from 'styled-components/native';

export const PostContainer = styled.TouchableOpacity`
  /* margin-bottom: 15px; */

  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.lineSeparator};
`;

export const CategoriesView = styled.View`
  margin: 12px 40px 26px 40px;
`;

export const CategoryText = styled.Text`
  color: ${props => props.theme.colors.textSecundary};
  font-family: 'Roboto-Regular';
  font-size: 12px;
  margin-bottom: 11px;
`;

export const QuestionView = styled.View``;

export const QuestionText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Roboto-Medium';
  font-size: 18px;
`;
export const Description = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 12px;
  color: ${props => props.theme.colors.textSecundary};
  margin-bottom: 10px;
`;
export const UsersView = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

export const QuestionRoomsWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const QuestionRooms = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecundary};
  margin-right: 10px;
`;

export const QuestionRoomsView = styled.View`
  flex-direction: row;
  justify-content: space-between;

  flex-direction: row;
  align-items: center;
  margin-top: 16px;
`;

export const CategoryTextView = styled.View`
  flex-direction: row;
`;

export const UserText = styled.TouchableOpacity``;

export const CreatedAtText = styled.Text`
  color: ${props => props.theme.colors.textSecundary};
`;
