/* eslint-disable prettier/prettier */
import React, {createContext} from 'react';
import dark from '../themes/dark';
import light from '../themes/light';
import usePersistedState from './usePersistedState';

interface ToggleThemeContextData {
  theme: {
    title: string;
    colors: {
      primary: string;
      secundary: string;

      background: string;
      error: string;
      text: string;
      textSecundary: string;
    };
  };
  toggleTheme: () => void;
}

export const ToggleThemeContext = createContext({} as ToggleThemeContextData);

export function ToggleThemeProvider({children, themeValue}) {
  const [theme, setTheme] = usePersistedState('theme', themeValue, dark);

  const toggleTheme = () => {
    setTheme(theme.title === 'light' ? dark : light);
  };

  return (
    <ToggleThemeContext.Provider value={{theme, toggleTheme}}>
      {children}
    </ToggleThemeContext.Provider>
  );
}
