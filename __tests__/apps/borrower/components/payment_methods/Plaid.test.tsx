import React from 'react';
import { usePlaidLink } from 'react-plaid-link';

import Plaid from '@apps/borrower/components/payment_methods/Plaid';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import usePlaid from '@hooks/usePlaid';
import useToast from '@hooks/useToast';
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

const mockUseBorrowerDeps = useBorrowerDeps as jest.MockedFunction<typeof useBorrowerDeps>;
const mockUseEntity = useEntity as jest.MockedFunction<typeof useEntity>;
const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockUsePlaid = usePlaid as jest.MockedFunction<typeof usePlaid>;
const mockUsePlaidLink = usePlaidLink as jest.MockedFunction<typeof usePlaidLink>;
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;

const fetchLinkToken = jest.fn();

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
    mockUseBorrowerDeps.mockReturnValue({ refetchPaymentMethods: jest.fn() } as any);
    mockUseEntity.mockReturnValue({
      entity: { bank_verification_attempts: 0 },
      fetchEntity: jest.fn(),
    } as any);
    mockUseUser.mockReturnValue({ user: { id: 'user-1' } } as any);
    mockUseToast.mockReturnValue({ makeToast: jest.fn() } as any);
    mockUsePlaidLink.mockReturnValue({ open: jest.fn(), ready: true } as any);
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
});
