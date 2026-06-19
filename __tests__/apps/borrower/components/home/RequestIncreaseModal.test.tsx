import React, { useState } from 'react';

import RequestIncreaseModal from '@apps/borrower/components/home/RequestIncreaseModal';
import { act, customRender, fireEvent, screen } from '@lib/testing/test-utils';

jest.mock('@components/modals/ModalWrapper', () => ({
  __esModule: true,
  default: ({ children, header, isModalActive, toggleModal, disableDismiss }) =>
    isModalActive ? (
      <div>
        <div>{header}</div>
        <button type="button" onClick={toggleModal} disabled={disableDismiss}>
          Close modal
        </button>
        {children}
      </div>
    ) : null,
}));

describe('RequestIncreaseModal', () => {
  test('renders first-step UI with current credit limit and dollar-prefixed amount input', () => {
    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={22500}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Request Credit Line Increase' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('See if you qualify for a larger credit line in just a few minutes.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Current Credit Limit')).toBeInTheDocument();
    expect(screen.getByText('$22,500.00')).toBeInTheDocument();
    expect(
      screen.getByLabelText('What is the additional amount you are requesting?'),
    ).toHaveAttribute('placeholder', '$');
    expect(screen.getByLabelText(/comments/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  test('keeps Continue disabled when the request cannot proceed without a company id', () => {
    customRender(
      <RequestIncreaseModal
        currentCreditLimit={20000}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });

    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  test('continues to the verification-method selection step when no Plaid account is connected', () => {
    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount={false}
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.change(screen.getByLabelText(/comments/i), {
      target: { value: 'Need additional purchasing flexibility' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByRole('heading', { name: 'Verify your bank account' })).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: 'Verification method' })).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: 'Connect bank account with Plaid' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('radio', { name: 'Upload bank statements manually' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText('What is the additional amount you are requesting?'),
    ).not.toBeInTheDocument();

    const plaidRadio = screen.getByRole('radio', { name: 'Connect bank account with Plaid' });
    const manualRadio = screen.getByRole('radio', { name: 'Upload bank statements manually' });
    const plaidCard = screen.getByText('Connect bank account with Plaid');
    const manualCard = screen.getByText('Upload bank statements manually');

    expect(plaidCard).not.toHaveClass('border-primary-blue');
    expect(plaidCard).not.toHaveClass('bg-primary-blue/5');
    expect(plaidCard).not.toHaveClass('ring-2');
    expect(manualCard).not.toHaveClass('border-primary-blue');
    expect(manualCard).not.toHaveClass('bg-primary-blue/5');
    expect(manualCard).not.toHaveClass('ring-2');

    act(() => {
      plaidRadio.focus();
    });
    expect(plaidRadio).toHaveFocus();
    expect(plaidCard).toHaveClass('ring-2', 'ring-primary-blue', 'ring-offset-2');
    expect(manualCard).not.toHaveClass('ring-2');

    fireEvent.click(plaidRadio);
    expect(plaidRadio).toBeChecked();
    expect(plaidCard).toHaveClass('border-primary-blue', 'bg-primary-blue/5');
    expect(manualCard).not.toHaveClass('border-primary-blue');
    expect(manualCard).not.toHaveClass('bg-primary-blue/5');
    expect(manualRadio).not.toBeChecked();
  });

  test('shows the connected-bank interim step first when a Plaid account is already connected and can switch to method selection', () => {
    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByRole('heading', { name: 'Review Increase Request' })).toBeInTheDocument();
    expect(screen.getByText(/you already have a bank account connected/i)).toBeInTheDocument();
    expect(screen.getByText('Increase request preview')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Change connected bank' }));

    expect(screen.getByRole('heading', { name: 'Verify your bank account' })).toBeInTheDocument();
  });

  test('resets back to the first step when the modal is closed and reopened', () => {
    function RequestIncreaseModalHarness() {
      const [isModalActive, setIsModalActive] = useState(true);

      return (
        <div>
          <button type="button" onClick={() => setIsModalActive(true)}>
            Open modal
          </button>
          <RequestIncreaseModal
            companyId="123"
            currentCreditLimit={20000}
            hasConnectedPlaidAccount={false}
            isModalActive={isModalActive}
            toggleModal={() => setIsModalActive(false)}
          />
        </div>
      );
    }

    customRender(<RequestIncreaseModalHarness />);

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.change(screen.getByLabelText(/comments/i), {
      target: { value: 'Need additional purchasing flexibility' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByRole('heading', { name: 'Verify your bank account' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open modal' }));

    expect(
      screen.getByRole('heading', { name: 'Request Credit Line Increase' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('What is the additional amount you are requesting?')).toHaveValue(
      '',
    );
    expect(screen.getByLabelText(/comments/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });
});
