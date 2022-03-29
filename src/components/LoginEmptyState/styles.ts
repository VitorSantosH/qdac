import styled from 'styled-components/native';

export const Container = styled.View`
  align-self: center;
  height: 100px;
  align-items: flex-start;
`;

export const Title = styled.Text`
  width: 100%;
  color: ${props => props.theme.colors.text};
  text-align: center;
`;

export const TitleButton = styled.TouchableOpacity`
  margin: 0 5px 0 0;
  text-align: center;
`;

export const TitleButtonText = styled.Text`
  color: ${props => props.theme.colors.primary};
  font-family: 'Roboto-Medium';
`;

export const Wrapper = styled.View`
  width: 100%;
  height: 100px;
  flex-direction: row;
  max-width: 240px;
  flex-wrap: wrap;
  justify-content: center;
`;
