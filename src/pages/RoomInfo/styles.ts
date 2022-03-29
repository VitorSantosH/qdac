import styled from 'styled-components/native';
import { css } from 'styled-components';

interface IButtonProps {
  isFilled?: boolean;
}

interface IButtonTextProps {
  isFilled?: boolean;
}

export const Container = styled.View`
  padding: 30px 30px 40px 30px;
`;

export const ScrollView = styled.ScrollView``;

export const DescriptionView = styled.View`
  margin-top: 10px;
  margin-bottom: 14px;

  flex-direction: row;
  justify-content: space-between;
`;

export const Title = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Roboto-Regular';
  font-size: 14px;
`;

export const EditButton = styled.TouchableOpacity`
  width: 72px;
  height: 20px;
  background: ${props => props.theme.colors.primary};
  border-radius: 30px;

  align-items: center;
  justify-content: center;
`;

export const Description = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Roboto-Regular';
  font-size: 14px;
  line-height: 25px;
`;

export const Divider = styled.View`
  width: 100%;
  height: 1px;
  background: ${props => props.theme.colors.secundary};
  margin-top: 20px;
  margin-bottom: 27px;
`;

export const UserInfoContainer = styled.View`
  height: 53px;
  background: ${props => props.theme.colors.secundary};
  padding: 0 15px;
  margin-bottom: 5px;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const UserView = styled.View`
  flex-direction: row;

  align-items: center;
`;

export const UserImage = styled.Image`
  height: 30px;
  width: 30px;
  border-radius: 15px;
  margin-right: 10px;
`;

export const UserName = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 14px;
  color: ${props => props.theme.colors.text};
`;

export const AdminView = styled.View`
  width: 72px;
  height: 20px;
  border-radius: 30px;
  background: ${props => props.theme.colors.primary};

  align-items: center;
  justify-content: center;
`;

export const AdminText = styled.Text`
  color: #000;
  font-family: 'Roboto-Regular';
  font-size: 12px;
`;

export const RemoveUserButton = styled.TouchableOpacity``;

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
