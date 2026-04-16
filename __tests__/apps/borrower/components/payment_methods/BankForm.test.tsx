import React from 'react';

import BankForm from '@apps/borrower/components/payment_methods/forms/BankForm';
import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import useToast from '@hooks/useToast';
import { generateBankAgreement } from '@lib/actions/payment_methods';
import { customRender, fireEvent, screen, waitFor } from '@lib/testing/test-utils';

jest.mock('@contexts/EntityContext');
jest.mock('@contexts/UserContext', () => ({
  ...jest.requireActual('@contexts/UserContext'),
  useUser: jest.fn(),
}));
jest.mock('@contexts/BorrowerContext', () => ({
  ...jest.requireActual('@contexts/BorrowerContext'),
  useBorrowerDeps: jest.fn().mockReturnValue({
    refetchPaymentMethods: jest.fn(),
    defaultTermSettings: [],
  }),
}));
jest.mock('@lib/actions/payment_methods', () => ({
  createPaymentMethodBank: jest.fn(),
  generateBankAgreement: jest.fn(),
}));
jest.mock('@hooks/useApi', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));
jest.mock('@hooks/useToast');

const mockUseEntity = useEntity as jest.MockedFunction<typeof useEntity>;
const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;
const mockGenerateBankAgreement = generateBankAgreement as jest.MockedFunction<
  typeof generateBankAgreement
>;

const defaultEntityReturn = {
  entity: { id: 'entity-1', is_bank_connected: false },
  setEntity: jest.fn(),
  fetchEntity: jest.fn(),
  entityError: null,
  entityLoading: false,
};

const defaultProps = {
  hasAlert: false,
  next: jest.fn(),
  setHasAlert: jest.fn(),
  toggleModal: jest.fn(),
  createVcFlow: true,
  submitButtonText: 'Next',
};

describe('BankForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseEntity.mockReturnValue(defaultEntityReturn);
    mockUseUser.mockReturnValue({ user: { id: 'user-1' } } as any);
    mockUseToast.mockImplementation(() => ({ makeToast: jest.fn() }) as any);
    mockGenerateBankAgreement.mockResolvedValue('<p>Bank agreement</p>');
  });

  test('renders the submit button', () => {
    customRender(<BankForm {...defaultProps} />, { withBorrowerProviders: true });

    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  test('renders field labels for routing number and account number', async () => {
    customRender(<BankForm {...defaultProps} />, { withBorrowerProviders: true });

    await waitFor(() => {
      expect(screen.getByText('Routing Number')).toBeInTheDocument();
      expect(screen.getByText('Account Number')).toBeInTheDocument();
    });
  });

  test('calls onBankValuesChange on window blur event', async () => {
    const onBankValuesChange = jest.fn();

    customRender(<BankForm {...defaultProps} onBankValuesChange={onBankValuesChange} />, {
      withBorrowerProviders: true,
    });

    await waitFor(() => {
      expect(screen.getByText('Routing Number')).toBeInTheDocument();
    });

    fireEvent(window, new Event('blur'));

    expect(onBankValuesChange).toHaveBeenCalledWith(
      expect.objectContaining({
        bank_routing: expect.any(String),
        bank_account: expect.any(String),
        account_holder: expect.any(String),
      }),
    );
  });

  test('does not error when onBankValuesChange is not provided', () => {
    customRender(<BankForm {...defaultProps} />, { withBorrowerProviders: true });

    expect(() => {
      fireEvent(window, new Event('blur'));
    }).not.toThrow();
  });

  test('does not refetch the bank agreement on rerender when toast callback identity changes', async () => {
    const { rerender } = customRender(<BankForm {...defaultProps} />, {
      withBorrowerProviders: false,
    });

    await waitFor(() => {
      expect(mockGenerateBankAgreement).toHaveBeenCalledTimes(1);
    });

    rerender(<BankForm {...defaultProps} />);

    await waitFor(() => {
      expect(mockGenerateBankAgreement).toHaveBeenCalledTimes(1);
    });
  });

  test('refetches the bank agreement and disables submit when the user changes', async () => {
    let resolveSecondAgreement;
    mockGenerateBankAgreement.mockResolvedValueOnce('<p>Bank agreement</p>').mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveSecondAgreement = resolve;
        }) as any,
    );

    const { rerender } = customRender(<BankForm {...defaultProps} />, {
      withBorrowerProviders: false,
    });

    await waitFor(() => {
      expect(mockGenerateBankAgreement).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(
        screen.getByText('I authorize Credit Key to charge scheduled payments to my bank account.'),
      ).toBeInTheDocument();
    });

    mockUseUser.mockReturnValue({ user: { id: 'user-2' } } as any);
    rerender(<BankForm {...defaultProps} />);

    await waitFor(() => {
      expect(mockGenerateBankAgreement).toHaveBeenCalledTimes(2);
    });

    expect(screen.getByLabelText('save-payment-method-button')).toBeDisabled();

    resolveSecondAgreement('<p>New bank agreement</p>');

    await waitFor(() => {
      expect(screen.getByLabelText('save-payment-method-button')).not.toBeDisabled();
    });
  });
});
