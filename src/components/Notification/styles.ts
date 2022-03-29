import styled from 'styled-components/native';

export const Container = styled.View`
  height: 120px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.secundary};
  padding: 9px 27px 20px 40px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const UserInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const UserAvatar = styled.Image`
  height: 35px;
  width: 35px;
  border-radius: 20px;
  margin-right: 10px;
`;

export const UserName = styled.Text`
  font-family: 'Roboto-Bold';
  font-size: 18px;
  color: ${props => props.theme.colors.text};
`;

export const Description = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 12px;
  color: ${props => props.theme.colors.textSecundary};
`;

export const Content = styled.Text`
  font-family: 'Roboto-Medium';
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  margin-top: 7px;
`;
