import React, { createContext, ReactNode, useContext, useState } from 'react';

import { AuthModal } from '../components/AuthModal';

import type { AuthType } from '../components/AuthModal';

interface AuthModalContext {
  handleOpenModal: (auth: AuthType) => void;
  handleCloseModal: () => void;
  isVisible: boolean;
}

interface AuthModalProviderProps {
  children: ReactNode;
}

const AuthModalContext = createContext<AuthModalContext | undefined>(undefined);

export function AuthModalProvider({ children }: AuthModalProviderProps) {
  const [autType, setAuthType] = useState<AuthType | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  function handleOpenModal(auth: AuthType) {
    if (isVisible) {
      return setAuthType(auth);
    }

    setAuthType(auth);
    setIsVisible(true);
  }

  function handleCloseModal() {
    if (!isVisible) {
      return;
    }

    setAuthType(null);
    setIsVisible(false);
  }

  return (
    <AuthModalContext.Provider
      value={{ handleCloseModal, handleOpenModal, isVisible }}>
      {isVisible && <AuthModal authType={autType} isVisible={isVisible} />}
      {children}
    </AuthModalContext.Provider>
  );
}

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);

  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }

  return context;
};
