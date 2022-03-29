import styled, { css } from 'styled-components/native';

interface IButtonProps {
  isFilled?: boolean;
  theme: any;
}

export const Container = styled.View`
  background: ${props => props.theme.colors.background};
  flex: 1;
  align-items: center;
  padding: 40px;
  padding-top: 0;
`;
export const Image = styled.Image`
  margin: 40px 0px;
  width: 150px;
  height: 190px;
`;

export const WellcomeText = styled.Text`
  margin-top: 20px;
  padding: 0 20px;
  color: ${props => props.theme.colors.primary};
  font-family: 'Roboto-Regular';
  font-size: 12px;
  line-height: 25px;
  text-align: center;
`;

export const ButtonContainer = styled.View`
  background: ${props => props.theme.colors.background};
  flex-direction: row;
  width: 80%;
  position: absolute;
  bottom: 50px;
  align-self: center;
`;

export const Button = styled.TouchableOpacity<IButtonProps>`
  width: 137px;
  height: 56px;
  border-radius: 100px;
  background-color: ${(props: IButtonProps) =>
    props.isFilled
      ? props.theme.colors.primary
      : props.theme.colors.background};
  ${(props: IButtonProps) =>
    !props.isFilled &&
    css`
      border: 1px solid ${props.theme.colors.primary};
    `}
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  margin-top: 50px;
`;

export const ButtonText = styled.Text<IButtonProps>`
  font-family: 'Roboto-Medium';
  font-size: 15px;
  color: ${(props: IButtonProps) =>
    props.isFilled ? props.theme.colors.background : props.theme.colors.text};
`;
