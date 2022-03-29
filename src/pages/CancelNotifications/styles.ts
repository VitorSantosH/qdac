import styled from 'styled-components/native';

export const Container = styled.View`
  padding-top: 15px;
`;

export const Title = styled.Text`
  margin-left: 25px;
  font-family: 'Roboto-Medium';
  font-size: 18px;
  color: ${props => props.theme.colors.text};
  margin-bottom: 17px;
`;

export const SwitchView = styled.View`
  background: ${props => props.theme.colors.secundary};
  height: 57px;
  padding-left: 25px;
  margin-bottom: 17px;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const Text = styled.Text`
  font-family: 'Roboto-Medium';
  font-size: 18px;
  color: ${props => props.theme.colors.text};
`;
