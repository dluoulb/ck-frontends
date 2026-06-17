import React from 'react';

import ModalWrapper from '@components/modals/ModalWrapper';
import { customRender, fireEvent, screen } from '@lib/testing/test-utils';

jest.mock('@headlessui/react', () => {
  return {
    Dialog: ({ children, onClose, className }) => (
      <div data-testid="dialog" className={className}>
        <button type="button" onClick={() => onClose(false)}>
          Trigger dialog close
        </button>
        {children}
      </div>
    ),
    DialogBackdrop: ({ children }) => <div>{children}</div>,
    DialogPanel: ({ children, className }) => <div className={className}>{children}</div>,
    Transition: ({ show, children }) => (show ? <>{children}</> : null),
    TransitionChild: ({ children }) => <>{children}</>,
  };
});

describe('ModalWrapper', () => {
  test('allows dialog dismissal when disableDismiss is not set', () => {
    const toggleModal = jest.fn();

    customRender(
      <ModalWrapper isModalActive toggleModal={toggleModal}>
        <div>Modal content</div>
      </ModalWrapper>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Trigger dialog close' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(toggleModal).toHaveBeenCalledTimes(2);
  });

  test('blocks dialog dismissal and disables the close button when disableDismiss is set', () => {
    const toggleModal = jest.fn();

    customRender(
      <ModalWrapper isModalActive toggleModal={toggleModal} disableDismiss>
        <div>Modal content</div>
      </ModalWrapper>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Trigger dialog close' }));

    expect(toggleModal).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Close' })).toBeDisabled();
  });
});
