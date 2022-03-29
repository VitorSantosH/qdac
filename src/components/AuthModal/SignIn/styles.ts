import styled from 'styled-components/native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export const Container = styled.View`
  margin: 0 auto;
  max-width: 272px;
  width: ${({}) => wp('100')}px;
`;

export const Title = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 36px;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 18px;
`;

export const Text = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 15px;
  color: ${props => props.theme.colors.text};
  margin-bottom: 45px;
`;

export const DescriptionContainer = styled.View`
  flex-direction: row;
`;

export const Description = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 12px;
  color: ${props => props.theme.colors.textSecundary};
  margin-right: 5px;
`;

export const DescriptionButton = styled.TouchableNativeFeedback``;

export const ButtonText = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 12px;
  color: ${props => props.theme.colors.primary};
`;

export const Button = styled.TouchableOpacity`
  width: 100%;
  height: 60px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.primary};
  align-self: center;
`;

export const BottomButtonText = styled.Text`
  color: ${props => props.theme.colors.background};
  font-family: 'Roboto-Medium';
  font-size: 18px;
`;

export const ForgotPassword = styled.TouchableOpacity`
  align-self: center;
  margin-bottom: 18px;
  width: 100%;
  margin-top: 25px;

  align-items: center;
`;

export const ForgotPasswordText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-family: 'Roboto-Regular';
  font-size: 14px;
`;
