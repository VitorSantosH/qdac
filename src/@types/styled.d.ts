/* eslint-disable prettier/prettier */
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    title: string;
    colors: {
      primary: string;
      secundary: string;

      background: string;
      inputBackground: string;
      text: string;
      textSecundary: string;
      error: string;
      headerBackground: string;
      chatText: string;
      modalBackground: string;
      lineSeparator: string;
    };
  }
}
