import dark from './dark';
import light from './light';

export interface Theme {
  title: string;
  colors: Colors;
}

export interface Colors {
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
}

export { dark, light };
