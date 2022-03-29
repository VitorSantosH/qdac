import styled, { css } from 'styled-components/native';

import type { ButtonVariant } from './modal';

interface ButtonProps {
  variant: ButtonVariant;
}

export const Container = styled.Modal``;

export const ModalOverlay = styled.View`
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
`;

export const ModalView = styled.View`
  width: 277px;
  border-radius: 16px;
  background: ${props => props.theme.colors.modalBackground};
  padding: 20px 30px;

  align-items: center;
  justify-content: space-between;
`;

export const ModalDescription = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  line-height: 20px;
  text-align: center;
  margin-top: 24px;
`;

export const FooterContent = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 18px;
`;

export const ButtonText = styled.Text<ButtonProps>`
  color: ${({ theme, variant }) =>
    variant === 'solid' ? theme.colors.modalBackground : theme.colors.primary};
`;

export const Button = styled.TouchableOpacity<ButtonProps | any>`
  ${props => (props.variant === 'solid' ? buttonSolid : buttonOutline)}

  margin-top: 8px;
`;

const buttonSolid = css`
  background: ${props => props.theme.colors.primary};

  width: 224px;
  height: 40px;
  border-radius: 100px;

  align-items: center;
  justify-content: center;
`;

const buttonOutline = css`
  border: 1px solid ${props => props.theme.colors.primary};

  width: 224px;
  height: 40px;
  border-radius: 100px;

  align-items: center;
  justify-content: center;
`;
