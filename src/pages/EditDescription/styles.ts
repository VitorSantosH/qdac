import styled from 'styled-components/native';

export const Container = styled.View`
  padding: 30px 30px 0px 30px;
`;

export const Title = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Roboto-Regular';
  font-size: 14px;
`;

export const TextInput = styled.TextInput`
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.text};
  line-height: 20px;
`;

export const Button = styled.TouchableOpacity`
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background: ${props => props.theme.colors.primary};
  position: absolute;
  bottom: 32px;
  right: 18px;

  align-items: center;
  justify-content: center;
`;
