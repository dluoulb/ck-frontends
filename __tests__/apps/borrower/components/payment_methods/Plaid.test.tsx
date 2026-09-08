import React from 'react';
import { usePlaidLink } from 'react-plaid-link';

import Plaid from '@apps/borrower/components/payment_methods/Plaid';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import usePlaid from '@hooks/usePlaid';
import useToast from '@hooks/useToast';
import { createPaymentMethodBank } from '@lib/actions/payment_methods';
import { customRender, waitFor } from '@lib/testing/test-utils';

jest.mock('react-plaid-link', () => ({
  usePlaidLink: jest.fn(),
}));
jest.mock('@contexts/BorrowerContext', () => ({
  ...jest.requireActual('@contexts/BorrowerContext'),
  useBorrowerDeps: jest.fn(),
}));
jest.mock('@contexts/EntityContext');
jest.mock('@contexts/UserContext', () => ({
  ...jest.requireActual('@contexts/UserContext'),
  useUser: jest.fn(),
}));
jest.mock('@hooks/useApi', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));
jest.mock('@hooks/usePlaid');
jest.mock('@hooks/useToast');
jest.mock('@lib/actions/payment_methods', () => ({
  createPaymentMethodBank: jest.fn(),
}));

const mockUseBorrowerDeps = useBorrowerDeps as jest.MockedFunction<typeof useBorrowerDeps>;
const mockUseEntity = useEntity as jest.MockedFunction<typeof useEntity>;
const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockUsePlaid = usePlaid as jest.MockedFunction<typeof usePlaid>;
const mockUsePlaidLink = usePlaidLink as jest.MockedFunction<typeof usePlaidLink>;
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;
const mockCreatePaymentMethodBank = createPaymentMethodBank as jest.MockedFunction<
  typeof createPaymentMethodBank
>;

const fetchLinkToken = jest.fn();
const openPlaidLink = jest.fn();
const refetchPaymentMethods = jest.fn();

const defaultProps = {
  hasAlert: false,
  next: jest.fn(),
  setHasAlert: jest.fn(),
  toggleModal: jest.fn(),
  setUsePlaid: jest.fn(),
};

describe('Plaid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseBorrowerDeps.mockReturnValue({ refetchPaymentMethods } as any);
    mockUseEntity.mockReturnValue({
      entity: { bank_verification_attempts: 0 },
      fetchEntity: jest.fn(),
    } as any);
    mockUseUser.mockReturnValue({ user: { id: 'user-1' } } as any);
    mockUseToast.mockReturnValue({ makeToast: jest.fn() } as any);
    mockUsePlaidLink.mockReturnValue({ open: openPlaidLink, ready: true } as any);
    mockUsePlaid.mockImplementation(() => ({
      fetchLinkToken,
      linkToken: 'link-token',
      linkTokenLoading: false,
      resetLinkFlow: jest.fn(),
      accessToken: null,
      fetchAccessToken: jest.fn(),
      accessTokenLoading: false,
      exchangePublicToken: jest.fn(),
    }));
    mockCreatePaymentMethodBank.mockResolvedValue({
      id: 'pm-bank-2',
      payment_type: 'bank_account',
      label: 'Chase Business Checking',
      account_number_masked: '••••1234',
      payment_method_last_4: '1234',
    } as any);
    refetchPaymentMethods.mockResolvedValue({ data: [] } as any);
  });

  test('auto-opens Plaid Link when autoOpen is enabled', async () => {
    const { rerender } = customRender(<Plaid {...defaultProps} autoOpen />, {
      withBorrowerProviders: false,
    });

    await waitFor(() => {
      expect(openPlaidLink).toHaveBeenCalledTimes(1);
    });

    rerender(<Plaid {...defaultProps} autoOpen />);

    await waitFor(() => {
      expect(openPlaidLink).toHaveBeenCalledTimes(1);
    });
  });

  test('does not refetch the link token on rerender when Plaid callbacks change identity', async () => {
    const { rerender } = customRender(<Plaid {...defaultProps} />, {
      withBorrowerProviders: false,
    });

    await waitFor(() => {
      expect(fetchLinkToken).toHaveBeenCalledTimes(1);
    });

    rerender(<Plaid {...defaultProps} />);

    await waitFor(() => {
      expect(fetchLinkToken).toHaveBeenCalledTimes(1);
    });
  });

  test('refetches the link token when the user changes', async () => {
    const { rerender } = customRender(<Plaid {...defaultProps} />, {
      withBorrowerProviders: false,
    });

    await waitFor(() => {
      expect(fetchLinkToken).toHaveBeenCalledTimes(1);
    });

    mockUseUser.mockReturnValue({ user: { id: 'user-2' } } as any);
    rerender(<Plaid {...defaultProps} />);

    await waitFor(() => {
      expect(fetchLinkToken).toHaveBeenCalledTimes(2);
    });
  });

  test('refreshes borrower state and passes the created bank back before advancing createVcFlow', async () => {
    const fetchEntity = jest.fn();
    let resolveRefetch;

    mockUseEntity.mockReturnValue({
      entity: { bank_verification_attempts: 0 },
      fetchEntity,
    } as any);
    refetchPaymentMethods.mockReturnValue(
      new Promise((resolve) => {
        resolveRefetch = resolve;
      }) as any,
    );
    mockUsePlaid.mockImplementation(() => ({
      fetchLinkToken,
      linkToken: 'link-token',
      linkTokenLoading: false,
      resetLinkFlow: jest.fn(),
      accessToken: true,
      fetchAccessToken: jest.fn(),
      accessTokenLoading: false,
      exchangePublicToken: jest.fn(),
    }));

    const next = jest.fn();
    const onPaymentMethodCreated = jest.fn();

    customRender(
      <Plaid
        {...defaultProps}
        createVcFlow={true}
        next={next}
        onPaymentMethodCreated={onPaymentMethodCreated}
      />,
      {
        withBorrowerProviders: false,
      },
    );

    await waitFor(() => {
      expect(mockCreatePaymentMethodBank).toHaveBeenCalledTimes(1);
    });

    expect(fetchEntity).toHaveBeenCalledTimes(1);
    expect(onPaymentMethodCreated).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();

    resolveRefetch({ data: [] });

    await waitFor(() => {
      expect(onPaymentMethodCreated).toHaveBeenCalledWith(
        expect.objectContaining({
          label: 'Chase Business Checking',
          account_number_masked: '••••1234',
        }),
      );
    });
    expect(next).toHaveBeenCalledTimes(1);
  });
});
