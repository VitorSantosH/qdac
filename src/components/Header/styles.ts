import styled from 'styled-components/native';

export const Container = styled.View`
  height: 70px;
  padding: 0 16px;
  background: ${props => props.theme.colors.headerBackground};
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.secundary};

  flex-direction: row;
  align-items: center;
`;

export const Title = styled.Text`
  font-family: 'Roboto-Medium';
  font-size: 24px;
  color: ${props => props.theme.colors.text};
`;

export const TextView = styled.View`
  margin-left: 27px;
`;

export const Description = styled.Text`
  font-family: 'Roboto-Regular';
  max-width: 250px;
  font-size: 12px;
  color:  ${props => props.theme.colors.text};
`;

export const UsersView = styled.TouchableOpacity`
  flex-direction: row;
  margin-left: auto;
`;

export const UsersText = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 18px;
  color: ${props => props.theme.colors.text};
`;
