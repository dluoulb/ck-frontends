import React from 'react';

import PaymentMethodModalWrapper from '@apps/borrower/components/payment_methods/modals/PaymentMethodModalWrapper';
import { customRender, fireEvent, screen } from '@lib/testing/test-utils';

jest.mock('@components/modals/ModalWrapper', () => ({
  __esModule: true,
  default: ({ children, isModalActive }) => (isModalActive ? <div>{children}</div> : null),
}));

jest.mock('@apps/borrower/components/payment_methods/modals/PaymentMethodModal', () => ({
  __esModule: true,
  default: ({ next }) => (
    <div>
      <div data-testid="payment-method-modal" />
      <button onClick={next}>Go To Next Step</button>
    </div>
  ),
}));

jest.mock('@apps/borrower/components/payment_methods/modals/BankPendHelp', () => ({
  __esModule: true,
  default: () => <div data-testid="bank-pend-help" />,
}));

describe('PaymentMethodModalWrapper', () => {
  test('renders the first step when the modal opens', () => {
    customRender(<PaymentMethodModalWrapper isModalActive={true} toggleModal={jest.fn()} />);

    expect(screen.getByTestId('payment-method-modal')).toBeInTheDocument();
    expect(screen.queryByTestId('bank-pend-help')).not.toBeInTheDocument();
  });

  test('advances to the next step', () => {
    customRender(<PaymentMethodModalWrapper isModalActive={true} toggleModal={jest.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Go To Next Step' }));

    expect(screen.getByTestId('bank-pend-help')).toBeInTheDocument();
    expect(screen.queryByTestId('payment-method-modal')).not.toBeInTheDocument();
  });

  test('preserves the current step across re-renders', () => {
    const props = { isModalActive: true, toggleModal: jest.fn() };
    const { rerender } = customRender(<PaymentMethodModalWrapper {...props} />);

    fireEvent.click(screen.getByRole('button', { name: 'Go To Next Step' }));

    expect(screen.getByTestId('bank-pend-help')).toBeInTheDocument();

    rerender(<PaymentMethodModalWrapper {...props} />);

    expect(screen.getByTestId('bank-pend-help')).toBeInTheDocument();
    expect(screen.queryByTestId('payment-method-modal')).not.toBeInTheDocument();
  });

  test('resets to the first step when the modal is reopened', () => {
    const props = { isModalActive: true, toggleModal: jest.fn() };
    const { rerender } = customRender(<PaymentMethodModalWrapper {...props} />);

    fireEvent.click(screen.getByRole('button', { name: 'Go To Next Step' }));

    expect(screen.getByTestId('bank-pend-help')).toBeInTheDocument();

    rerender(<PaymentMethodModalWrapper {...props} isModalActive={false} />);
    rerender(<PaymentMethodModalWrapper {...props} isModalActive={true} />);

    expect(screen.getByTestId('payment-method-modal')).toBeInTheDocument();
    expect(screen.queryByTestId('bank-pend-help')).not.toBeInTheDocument();
  });
});
