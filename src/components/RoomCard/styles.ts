import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  padding: 0 10px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.lineSeparator};
  margin-bottom: 11px;
  padding-left: 30px;
`;

export const Description = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 12px;
  color: ${props => props.theme.colors.textSecundary};
  margin-bottom: 11px;
`;

export const Title = styled.Text`
  font-family: 'Roboto-Medium';
  font-size: 18px;
  color: ${props => props.theme.colors.text};
`;

export const RoomContainer = styled.View`
  margin-bottom: 17px;

  flex-direction: row;
  justify-content: space-between;
`;

export const UsersContainer = styled.View`
  flex-direction: row;
`;
