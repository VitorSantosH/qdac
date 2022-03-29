import React from 'react';
import { ActivityIndicator, TouchableOpacityProps } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import styled from 'styled-components/native';

const Container = styled.TouchableOpacity`
  flex-direction: row;
  width: 100%;
  height: 60px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  background: #1877f2;
  margin-top: 20px;
  margin-bottom: 40px;
`;

const Text = styled.Text`
  font-family: 'Roboto-Regular';
  font-size: 16px;
  font-weight: bold;
  color: #ffff;
  margin-left: 14px;
`;

interface FacebookButtonProps extends TouchableOpacityProps {
  isLoading?: boolean;
}

export function FacebookButton({ isLoading, ...rest }: FacebookButtonProps) {
  return (
    <Container {...rest}>
      {isLoading ? (
        <ActivityIndicator size="small" color="#FFFF" />
      ) : (
        <>
          <Icon name="facebook" size={20} color="#FFFF" />
          <Text>Connectar com facebook</Text>
        </>
      )}
    </Container>
  );
}
