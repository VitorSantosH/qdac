import styled from 'styled-components/native';

import Icon from 'react-native-vector-icons/Feather';

interface IButtonProps {
  isFilled?: boolean;
  theme: any;
}

interface ButtonProps {
  red?: boolean;
}

export const CardContainer = styled.TouchableOpacity`
  width: 100%;

  margin-bottom: 15px;

  padding: 25px 30px 0 30px;
`;

export const CardTitle = styled.Text`
  font-family: 'Roboto-Medium';
  width: 85%;
  font-size: 18px;
  margin-right: 32px;
  color: ${props => props.theme.colors.text};
`;

export const QuestionIcon = styled(Icon)``;

export const Circle = styled.TouchableOpacity<ButtonProps>`
  position: absolute;
  right: ${props => (props.red ? '40px' : '0px')};
  height: 30px;
  width: 30px;
  border-radius: 15px;
  background: ${props =>
    props.red ? props.theme.colors.error : props.theme.colors.primary};

  align-items: center;
  justify-content: center;
`;

export const QuestionRooms = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.text};
`;

export const CardHeader = styled.View`
  flex-direction: row;
`;

export const CardInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 18px;
`;
