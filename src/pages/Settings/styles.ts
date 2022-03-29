import styled from 'styled-components/native';

import { css } from 'styled-components';

interface IButtonProps {
  isFilled?: boolean;
}

interface IButtonTextProps {
  isFilled?: boolean;
}

export const ModalOverlay = styled.View`
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.4);
`;

export const ModalView = styled.View`
  width: 277px;
  height: 242px;
  border-radius: 16px;
  background: ${props => props.theme.colors.modalBackground};
  padding: 20px 30px;

  align-items: center;
  justify-content: space-between;
`;

export const ModalDescription = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 15px;
  color: ${props => props.theme.colors.text};
  line-height: 20px;
  text-align: center;
`;

export const ButtonsView = styled.View`
  flex-direction: row;
`;

export const Button = styled.TouchableOpacity<IButtonProps>`
  ${props => props.isFilled && `background: ${props.theme.colors.primary}`}
  ${props => props.isFilled && 'margin-right: 29px'}
  ${props =>
    !props.isFilled &&
    css`
      border: 1px solid ${props.theme.colors.primary};
    `}

  width: 74px;
  height: 40px;
  border-radius: 100px;

  align-items: center;
  justify-content: center;
`;

export const ButtonText = styled.Text<IButtonTextProps>`
  color: ${props =>
    props.isFilled
      ? props.theme.colors.modalBackground
      : props.theme.colors.primary};
`;

export const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

export const TopicItem = styled.TouchableOpacity`
  background: ${props => props.theme.colors.background};
  margin-bottom: 1px;
  padding: 15px 20px 15px 33px;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.secundary};

  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const TopicItemText = styled.Text`
  font-family: 'Roboto-Medium';
  font-size: 18px;
  color: ${props => props.theme.colors.text};
`;

export const TopicItemDescription = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 12px;
  color: ${props => props.theme.colors.textSecundary};
`;

export const Footer = styled.View`
  margin: 36px 0;
`;

export const DisconnectButton = styled.TouchableOpacity`
  height: 45px;
  width: 120px;
  border: 1px solid ${props => props.theme.colors.error};
  border-radius: 20px;

  align-self: center;
  justify-content: center;
  align-items: center;
`;

export const DisconnectButtonText = styled.Text`
  font-family: 'Roboto-Medium';
  font-size: 18px;
  color: ${props => props.theme.colors.error};
`;

export const SignUpButton = styled.TouchableOpacity`
  height: 45px;
  width: 242px;
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 20px;

  align-self: center;
  justify-content: center;
  align-items: center;

  margin-bottom: 14px;
`;

export const SignUpButtonText = styled.Text`
  font-family: 'Roboto-Medium';
  font-size: 18px;
  color: ${props => props.theme.colors.primary};
`;

export const SignInButton = styled.TouchableOpacity`
  height: 45px;
  width: 242px;
  border: 1px solid ${props => props.theme.colors.primary};
  border-radius: 20px;

  align-self: center;
  justify-content: center;
  align-items: center;
`;

export const SignInButtonText = styled.Text`
  font-family: 'Roboto-Medium';
  font-size: 18px;
  color: ${props => props.theme.colors.primary};
`;
