import styled from 'styled-components/native';

export const Container = styled.KeyboardAvoidingView`
  flex: 1;
  background: ${props => props.theme.colors.background};
  justify-content: space-between;
`;

export const Content = styled.View`
  margin: 0 auto;
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
  line-height: 25px;
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
  margin-top: 20px;
  margin-bottom: 40px;
`;

export const BottomButtonText = styled.Text`
  color: ${props => props.theme.colors.background};
  font-family: 'Roboto-Medium';
  font-size: 18px;
`;

export const ScrollView = styled.ScrollView`
  margin: 0;
`;
