import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
  useContext,
} from 'react';

import { StyleProp, TextInputProps, ViewStyle } from 'react-native';

import { useField } from '@unform/core';

import { Container, TextInput, Icon } from './styles';
import { ThemeContext } from 'styled-components';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
  initialValue?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

interface InputValueReference {
  value: string;
}

interface InputRef {
  focus(): void;
}

const Input: React.ForwardRefRenderFunction<InputRef, InputProps> = (
  {
    name,
    icon,
    containerStyle = {},
    initialValue = '',
    multiline = false,
    ...rest
  },
  ref,
) => {
  const { colors } = useContext(ThemeContext);

  const inputElementRef = useRef<any>(null);

  const {
    registerField,
    defaultValue = initialValue,
    fieldName,
    error,
  } = useField(name);
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const handleInputFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsFocused(false);

    setIsFilled(!!inputValueRef.current.value);
  }, []);

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  useEffect(() => {
    inputValueRef.current.value = initialValue;
    inputElementRef.current.setNativeProps({ text: initialValue });
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(ref: any, value) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      },
    });
  }, [fieldName, registerField, initialValue]);

  return (
    <Container style={containerStyle} isFocused={isFocused} isErrored={!!error}>
      <Icon
        name={icon}
        size={20}
        color={isFocused || isFilled ? colors.primary : '#5E5E5E'}
      />

      <TextInput
        numberOfLines={2}
        multiline={multiline}
        ref={inputElementRef}
        keyboardAppearance="dark"
        onChangeText={value => {
          inputValueRef.current.value = value;
        }}
        placeholderTextColor="#5e5e5e"
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        {...rest}
      />
    </Container>
  );
};

export default forwardRef(Input);
