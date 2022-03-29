import styled from 'styled-components/native';

export const Container = styled.View``;

export const Section = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.secundary};
  height: 70px;
  padding: 0 20px;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const SectionText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 16px;
  font-family: 'Roboto-Medium';
`;
