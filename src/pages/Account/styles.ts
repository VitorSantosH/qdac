import styled from 'styled-components/native';

export const Container = styled.View`
  align-items: center;
  padding-top: 30px;
  margin-bottom: 30px;
`;

export const ProfileText = styled.TextInput`
  color: ${props => props.theme.colors.text};
  font-family: 'Roboto-Medium';
  font-size: 28px;
  margin-right: 15px;
`;

export const ProfileView = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 30px;
`;
