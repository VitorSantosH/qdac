import React, { useState, useImperativeHandle } from 'react';

export interface ModalHandles {
  handleModalOpen: () => void;
  handleModalClose: () => void;
}

interface UseModalProps {
  ref: React.ForwardedRef<ModalHandles>;
}

export function useModal({ ref }: UseModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  function handleModalOpen() {
    setIsVisible(true);
  }

  function handleModalClose() {
    setIsVisible(false);
  }

  useImperativeHandle(ref, () => {
    return {
      handleModalOpen,
      handleModalClose,
    };
  });

  return {
    handleModalOpen,
    handleModalClose,
    isVisible,
  };
}
