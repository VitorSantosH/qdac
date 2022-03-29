import {RectButton} from 'react-native-gesture-handler';
import styled from 'styled-components/native';

export const Container = styled.View`
  background: ${props => props.theme.colors.background};
  height: 100%;
  padding: 33px 30px 0 30px;
`;

export const Title = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Roboto-Regular';
  font-size: 24px;
  margin-bottom: 43px;
`;

export const Button = styled(RectButton)`
  height: 60px;
  width: 60px;
  border-radius: 30px;
  position: absolute;
  bottom: 20px;
  right: 15px;
  background: ${props => props.theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

export const Description = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecundary};
`;
