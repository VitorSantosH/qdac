import { RectButton } from 'react-native-gesture-handler';
import { css } from 'styled-components';
import styled from 'styled-components/native';

interface IButtonProps {
  isFilled?: boolean;
}

interface IButtonTextProps {
  isFilled?: boolean;
}

export const Container = styled.View`
  background: ${props => props.theme.colors.background};
  height: 100%;
`;

export const Title = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 24px;
  color: ${props => props.theme.colors.text};
  margin: 0px 12px 29px 30px;
  line-height: 32px;
`;

export const CategoryText = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 24px;
  color: ${props => props.theme.colors.text};
  margin: 25px 0 29px 30px;
  line-height: 32px;
`;

export const ScrollView = styled.FlatList`
  flex-grow: 1;
`;

export const Description = styled.Text`
  font-family: 'Roboto-Regular';
  color: ${props => props.theme.colors.textSecundary};
  font-size: 16px;
  margin-top: 15px;
  text-align: center;
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

export const ButtonText = styled.Text<IButtonTextProps>`
  color: ${props =>
    props.isFilled
      ? props.theme.colors.modalBackground
      : props.theme.colors.primary};
`;
