import styled from 'styled-components/native';

export const Container = styled.KeyboardAvoidingView`
  flex: 1;
  background: ${props => props.theme.colors.background};
  justify-content: space-between;
`;

export const ScrollView = styled.ScrollView``;
