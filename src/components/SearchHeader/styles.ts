import styled from 'styled-components/native';

export const Container = styled.View`
  height: 70px;
  background: ${props => props.theme.colors.background};
  padding-left: 12px;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.secundary};
`;

export const Text = styled.Text`
  font-family: 'Roboto-Medium';
  font-size: 32px;
  color: ${props => props.theme.colors.text};
`;
