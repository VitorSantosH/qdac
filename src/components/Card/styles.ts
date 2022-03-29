import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  height: 115px;
  width: 148px;
  border-radius: 10px;
  background: ${props => props.theme.colors.secundary};
  margin-bottom: 15px;
  margin-left: 10px;
  margin-right: 10px;

  align-items: center;
`;

export const Image = styled.Image`
  width: 148px;
  height: 54px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
`;

export const Title = styled.Text`
  font-family: 'Roboto-Regular';
  height: 30px;
  font-size: 18px;
  color: ${props => props.theme.colors.text};
  margin-top: 8px;
  text-align: center;
`;

export const Description = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 10px;
  color: ${props => props.theme.colors.textSecundary};
  margin-top: 3px;
`;
