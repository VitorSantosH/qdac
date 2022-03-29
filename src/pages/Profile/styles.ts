import styled, { css } from 'styled-components/native';

interface ButtonProps {
  outlined?: boolean;
}

interface IButtonProps {
  isFilled?: boolean;
}

interface IButtonTextProps {
  isFilled?: boolean;
}

export const Container = styled.ScrollView`
  flex-grow: 1;
  background: ${props => props.theme.colors.background};
  padding: 25px 48px 20px 48px;
`;

export const ImageView = styled.View`
  width: 175px;
  height: 175px;
  align-self: center;
`;

export const PhotoButton = styled.TouchableOpacity`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background: ${props => props.theme.colors.primary};
  position: absolute;
  bottom: 0;
  right: 0;
  align-items: center;
  justify-content: center;
`;

export const Button = styled.TouchableOpacity<ButtonProps>`
  width: 100%;
  height: 50px;
  border-radius: 10px;
  align-self: center;
  background: ${props =>
    props.outlined ? props.theme.colors.error : props.theme.colors.primary};
  margin-top: 15px;

  align-items: center;
  justify-content: center;
`;

export const ButtonText = styled.Text`
  font-family: 'Roboto-Medium';
  font-size: 18px;
  color: ${props => props.theme.colors.background};
`;

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

export const ModalButtonsView = styled.View`
  flex-direction: row;
`;

export const ModalButton = styled.TouchableOpacity<IButtonProps>`
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

export const ModalButtonText = styled.Text<IButtonTextProps>`
  color: ${props =>
    props.isFilled
      ? props.theme.colors.modalBackground
      : props.theme.colors.primary};
`;
