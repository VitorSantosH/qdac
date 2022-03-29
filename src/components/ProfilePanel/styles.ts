import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  width: 100%;
  padding: 18px 20px 18px 33px;
`;

export const Content = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ProfileInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ProfileName = styled.View`
  margin-left: 14px;
`;

export const UserName = styled.Text`
  font-family: 'Roboto-Bold';
  font-size: 18px;
  color: ${props => props.theme.colors.text};
`;

export const ViewProfile = styled.Text`
  font-family: 'Roboto-Medium';
  font-size: 15px;
  color: ${props => props.theme.colors.textSecundary};
`;
