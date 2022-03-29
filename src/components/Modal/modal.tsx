import React, { ComponentProps, forwardRef } from 'react';
import Icon from 'react-native-vector-icons/Feather';

import type { StyleProp, TouchableOpacityProps, ViewStyle } from 'react-native';

import { useModal, ModalHandles } from './use-modal';

import {
  Container,
  ModalOverlay,
  ModalView,
  ModalDescription,
  FooterContent,
  Button,
  ButtonText,
} from './modal.styles';

export type ButtonVariant = 'outline' | 'solid';

interface ModalButtonProps extends TouchableOpacityProps {
  variant: ButtonVariant;
  label: string;
}

type FooterProps = ModalButtonProps;

interface ModalProps {
  description: string;
  icon?: ComponentProps<typeof Icon>['name'];
  footerContentStyles?: StyleProp<ViewStyle>;
  footer?: (
    handleModalClose: Pick<ModalHandles, 'handleModalClose'>,
  ) => Array<FooterProps>;
}

/**
 * You don't have to create a new component for each modal on the app.
 *
 * @param description   - The modal description.
 * @param icon          - The icon modal(it is not require).
 * @param footer        - The footer is where houses the modal actions
 *                       (it is not require, if you don't set the modal actions
 *                       it just going to render a button to close this modal).
 */
const Modal = forwardRef<ModalHandles, ModalProps>(
  ({ description, icon, footerContentStyles, footer }, _ref) => {
    const { isVisible, handleModalClose } = useModal({
      ref: _ref,
    });

    return (
      <Container visible={isVisible} animationType="fade" transparent>
        <ModalOverlay>
          <ModalView>
            {icon && <Icon name={icon} size={71} color="#fffd00" />}
            <ModalDescription>{description}</ModalDescription>
            <FooterContent style={footerContentStyles}>
              {footer ? (
                footer({ handleModalClose }).map((buttonProps, index) => {
                  return <ModalButton {...buttonProps} key={index} />;
                })
              ) : (
                <ModalButton
                  label="Ok"
                  variant="outline"
                  onPress={handleModalClose}
                />
              )}
            </FooterContent>
          </ModalView>
        </ModalOverlay>
      </Container>
    );
  },
);

/**
 * @param variant   - This button should be either an outline or a solid button.
 * @param label     - The text that should this button render.
 */
function ModalButton({ variant, label, ...rest }: ModalButtonProps) {
  return (
    <Button variant={variant} {...rest}>
      <ButtonText variant={variant}>{label}</ButtonText>
    </Button>
  );
}

export { Modal, ModalButton };
