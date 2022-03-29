import { css } from 'styled-components';
import styled from 'styled-components/native';

interface IButtonTextProps {
  isFilled?: boolean;
}

export const Button = styled.TouchableOpacity`
  background: ${props => props.theme.colors.primary};
  width: 242px;
  height: 40px;
  border-radius: 100px;

  align-items: center;
  justify-content: center;
  margin-left: 4;
  margin-right: 4;
  margin-top: 12;
`;

export const ButtonText = styled.Text<IButtonTextProps>`
  color: ${props => props.theme.colors.modalBackground};
`;
