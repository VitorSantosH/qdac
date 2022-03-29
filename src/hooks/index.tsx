import { ThemeProvider } from 'styled-components';
import React, { useContext } from 'react';

import { AuthProvider } from './auth';
import { AuthModalProvider } from './auth.modal';

import { ToggleThemeContext } from './theme';

const AppProvider: React.FC = ({ children }) => {
  const { theme } = useContext(ToggleThemeContext);

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <AuthModalProvider>{children}</AuthModalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
