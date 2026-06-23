import React, { useState } from 'react';

import RequestIncreaseModal from '@apps/borrower/components/home/RequestIncreaseModal';
import useToast from '@hooks/useToast';
import { createLimitIncreaseRequest } from '@lib/actions/companies';
import { act, customRender, fireEvent, screen, waitFor } from '@lib/testing/test-utils';

const mockApi = {};
const mockMakeToast = jest.fn();
const plaidPropsHistory: any[] = [];
const bankFormPropsHistory: any[] = [];

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

jest.mock('@apps/borrower/components/payment_methods/Plaid', () => ({
  __esModule: true,
  default: (props) => {
    plaidPropsHistory.push(props);

    return (
      <div>
        <p>Plaid verification screen</p>
        <button type="button" onClick={props.onPaymentMethodCreated}>
          Complete Plaid verification
        </button>
        <button type="button" onClick={() => props.setUsePlaid(false)}>
          Switch to manual verification
        </button>
        <button type="button" onClick={props.toggleModal}>
          Close from Plaid
        </button>
      </div>
    );
  },
}));

jest.mock('@apps/borrower/components/payment_methods/forms/BankForm', () => ({
  __esModule: true,
  default: (props) => {
    bankFormPropsHistory.push(props);

    return (
      <div>
        <p>Manual bank verification screen</p>
        <p>{props.hasAlert ? 'Manual alert on' : 'Manual alert off'}</p>
        <button type="button" onClick={props.onPaymentMethodCreated}>
          Complete manual verification
        </button>
        <button type="button" onClick={() => props.setHasAlert(true)}>
          Trigger manual alert
        </button>
        <button type="button" onClick={props.toggleModal}>
          Close from manual
        </button>
      </div>
    );
  },
}));

jest.mock('@hooks/useApi', () => ({
  __esModule: true,
  default: jest.fn(() => mockApi),
}));

jest.mock('@hooks/useToast');

jest.mock('@lib/actions/companies', () => ({
  ...jest.requireActual('@lib/actions/companies'),
  createLimitIncreaseRequest: jest.fn(),
}));

const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;
const mockCreateLimitIncreaseRequest = createLimitIncreaseRequest as jest.MockedFunction<
  typeof createLimitIncreaseRequest
>;

describe('RequestIncreaseModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    plaidPropsHistory.length = 0;
    bankFormPropsHistory.length = 0;
    mockUseToast.mockReturnValue({ makeToast: mockMakeToast } as any);
    mockCreateLimitIncreaseRequest.mockResolvedValue({} as any);
  });

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

    expect(
      screen.getByRole('heading', { name: 'Bank Statement Verification' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'In order to complete your credit limit increase request, we need to verify some financial information with you.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Verification method' })).toBeInTheDocument();
    expect(
      screen.queryByRole('radiogroup', { name: 'Verification method' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Instant Bank Verification/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Upload bank statements/i })).toBeInTheDocument();
    expect(screen.getByText('Securely connect via Plaid instantly')).toBeInTheDocument();
    expect(
      screen.getByText('Manually upload. Takes up to 3 business days to get a decision.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Recommended')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Your bank credentials are encrypted and never stored by Credit Key. We use bank-level security to protect your information.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeEnabled();
    expect(
      screen.queryByLabelText('What is the additional amount you are requesting?'),
    ).not.toBeInTheDocument();

    const plaidRadio = screen.getByRole('radio', { name: /Instant Bank Verification/i });
    const manualRadio = screen.getByRole('radio', { name: /Upload bank statements/i });
    const plaidCard = plaidRadio.nextElementSibling as HTMLElement;
    const manualCard = manualRadio.nextElementSibling as HTMLElement;
    const recommendationBadge = screen.getByText('Recommended');
    const securityNote = screen
      .getByText(
        'Your bank credentials are encrypted and never stored by Credit Key. We use bank-level security to protect your information.',
      )
      .closest('div') as HTMLElement;
    const verificationContinueButton = screen.getByRole('button', { name: 'Continue' });

    expect(plaidRadio).toBeChecked();
    expect(manualRadio).not.toBeChecked();
    expect(plaidCard).toHaveClass('gap-[14px]', 'border-[#C4DBFC]', 'bg-[#F0F6FE]');
    expect(manualCard).toHaveClass('gap-[14px]', 'border-[#D9D9D9]', 'bg-white');
    expect(recommendationBadge).toHaveClass('ml-auto');
    expect(securityNote).toHaveClass('gap-[14px]', 'px-[10px]', 'py-[10px]');
    expect(verificationContinueButton).toHaveClass('h-[38px]', 'text-[15px]');

    act(() => {
      plaidRadio.focus();
    });
    expect(plaidRadio).toHaveFocus();
    expect(plaidCard).toHaveClass('ring-2', 'ring-primary-blue', 'ring-offset-2');
    expect(manualCard).not.toHaveClass('ring-2');

    fireEvent.click(plaidCard);
    expect(plaidRadio).toBeChecked();
    expect(plaidCard).toHaveClass('border-[#C4DBFC]', 'bg-[#F0F6FE]');
    expect(manualCard).toHaveClass('border-[#D9D9D9]', 'bg-white');
    expect(manualRadio).not.toBeChecked();

    fireEvent.click(screen.getByText('Upload bank statements'));
    expect(manualRadio).toBeChecked();
    expect(plaidRadio).not.toBeChecked();
  });

  test('continues into the Plaid verification screen from the default verification method', () => {
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
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByText('Plaid verification screen')).toBeInTheDocument();
  });

  test('lets the Plaid fallback switch the modal into the manual verification screen', () => {
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
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Switch to manual verification' }));

    expect(screen.getByText('Manual bank verification screen')).toBeInTheDocument();
  });

  test('can close the modal from the Plaid verification step', () => {
    function RequestIncreaseModalHarness() {
      const [isModalActive, setIsModalActive] = useState(true);

      return (
        <RequestIncreaseModal
          companyId="123"
          currentCreditLimit={20000}
          hasConnectedPlaidAccount={false}
          isModalActive={isModalActive}
          toggleModal={() => setIsModalActive(false)}
        />
      );
    }

    customRender(<RequestIncreaseModalHarness />);

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close from Plaid' }));

    expect(screen.queryByText('Plaid verification screen')).not.toBeInTheDocument();
  });

  test('continues into the manual verification screen when manual verification is selected', () => {
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
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByText('Upload bank statements'));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByText('Manual bank verification screen')).toBeInTheDocument();
  });

  test('threads manual alert state back into BankForm props', () => {
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
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByText('Upload bank statements'));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByText('Manual alert off')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Trigger manual alert' }));

    expect(screen.getByText('Manual alert on')).toBeInTheDocument();
    expect(bankFormPropsHistory.at(-1)?.hasAlert).toBe(true);
  });

  test('can close the modal from the manual verification step', () => {
    function RequestIncreaseModalHarness() {
      const [isModalActive, setIsModalActive] = useState(true);

      return (
        <RequestIncreaseModal
          companyId="123"
          currentCreditLimit={20000}
          hasConnectedPlaidAccount={false}
          isModalActive={isModalActive}
          toggleModal={() => setIsModalActive(false)}
        />
      );
    }

    customRender(<RequestIncreaseModalHarness />);

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByText('Upload bank statements'));
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close from manual' }));

    expect(screen.queryByText('Manual bank verification screen')).not.toBeInTheDocument();
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

    expect(
      screen.getByRole('heading', { name: 'Bank Statement Verification' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Instant Bank Verification')).toBeInTheDocument();
  });

  test('submits the request with the existing connected bank and closes the modal', async () => {
    const toggleModal = jest.fn();

    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        hasConnectedPlaidAccount
        isModalActive
        toggleModal={toggleModal}
      />,
    );

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.change(screen.getByLabelText(/comments/i), {
      target: { value: 'Need additional purchasing flexibility' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    fireEvent.click(screen.getByRole('button', { name: 'Continue with connected bank' }));

    await waitFor(() => {
      expect(mockCreateLimitIncreaseRequest).toHaveBeenCalledWith(
        expect.any(Object),
        '123',
        25000,
        'Need additional purchasing flexibility',
      );
    });
    expect(toggleModal).toHaveBeenCalledTimes(1);
    expect(mockMakeToast).toHaveBeenCalledWith(
      'Credit limit increase request submitted successfully.',
      'success',
    );
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

    expect(
      screen.getByRole('heading', { name: 'Bank Statement Verification' }),
    ).toBeInTheDocument();

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
