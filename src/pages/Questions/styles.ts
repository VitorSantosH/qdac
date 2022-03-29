import styled from 'styled-components/native';

import { RectButton } from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/Feather';

interface IButtonProps {
  isFilled?: boolean;
  theme: any;
}

interface IButtonTextProps {
  isFilled?: boolean;
  theme: any;
}

interface ButtonProps {
  red?: boolean;
}

export const Container = styled.View`
  background: ${props => props.theme.colors.background};
  height: 100%;
`;

export const QuestionsContainer = styled.View``;

export const Title = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 24px;
  color: ${props => props.theme.colors.text};
  margin-bottom: 20px;
  padding: 25px 30px 0 30px;
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

export const QuestionIcon = styled(Icon)``;

export const ButtonText = styled.Text<IButtonTextProps>`
  color: ${props =>
    props.isFilled
      ? props.theme.colors.modalBackground
      : props.theme.colors.primary};
`;

export const SearchContainer = styled.View`
  padding: 25px 30px 0 30px;
`;

export const InputContainer = styled.View`
  height: 45px;
  flex: 1;
  background: ${props => props.theme.colors.inputBackground};

  flex-direction: row;
  align-items: center;
`;

export const TextInput = styled.TextInput`
  color: ${props => props.theme.colors.text};
  width: 80%;
  padding-left: 14px;
`;

export const QuestionRooms = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.text};
`;

export const QuestionView = styled.View`
  height: 70px;
  flex-direction: row;
`;
