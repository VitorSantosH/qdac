import styled from 'styled-components/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import { css } from 'styled-components';

interface ContainerProps {
  isFocused: boolean;
  isErrored: boolean;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  height: 50px;
  padding: 0 12px;
  background: ${props => props.theme.colors.inputBackground};
  border-radius: 10px;
  border: 1px solid ${props => props.theme.colors.secundary};
  ${props =>
    props.isErrored &&
    css`
      border-color: ${props.theme.colors.error};
    `}
  ${props =>
    props.isFocused &&
    css`
      border-color: ${props.theme.colors.primary};
    `}
  margin-bottom: 11px;

  flex-direction: row;
  align-items: center;
`;

export const TextInput = styled.TextInput`
  flex: 1;
  color: ${props => props.theme.colors.text};
  font-size: 16px;
  font-family: 'Roboto-Regular';
`;

export const Icon = styled(FeatherIcon)`
  margin-right: 10px;
`;
