import React from 'react';

import ManageCardModal from '@apps/borrower/components/wallet/ManageCardModal';
import { useEntity } from '@contexts/EntityContext';
import useToast from '@hooks/useToast';
import { updateRechargeTerm } from '@lib/actions/companies';
import { getApprovedTerms } from '@lib/actions/entities';
import { getMerchant } from '@lib/actions/merchants';
import { customRender, fireEvent, screen, waitFor } from '@lib/testing/test-utils';

jest.mock('@contexts/EntityContext');
jest.mock('@hooks/useApi', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));
jest.mock('@hooks/useToast', () => ({
  __esModule: true,
  default: jest.fn(() => ({ makeToast: jest.fn() })),
}));
jest.mock('@lib/actions/companies', () => ({
  updateRechargeTerm: jest.fn(),
}));
jest.mock('@lib/actions/entities');
jest.mock('@lib/actions/merchants');

const mockUseEntity = useEntity as jest.MockedFunction<typeof useEntity>;
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;
const mockUpdateRechargeTerm = updateRechargeTerm as jest.MockedFunction<typeof updateRechargeTerm>;
const mockGetApprovedTerms = getApprovedTerms as jest.MockedFunction<typeof getApprovedTerms>;
const mockGetMerchant = getMerchant as jest.MockedFunction<typeof getMerchant>;

const mockMerchant = { id: 'merchant-virtual', name: 'Virtual' } as any;
const mockTerms = [
  { term: 3, term_period: 'monthly', rate: 0 },
  { term: 6, term_period: 'monthly', rate: 1.5 },
  { term: 12, term_period: 'monthly', rate: 1.74 },
];

const mockEntityWithTerm = {
  id: 'entity-1',
  type: 'company',
  recharge_settings: [
    { merchant_id: 'merchant-virtual', default_term: 12, default_term_period: 'monthly' },
  ],
  address: { address1: '123 Main St', city: 'Test City', state: 'CA', zip: '90000' },
  borrower: { first_name: 'Test', last_name: 'User' },
} as any;

describe('ManageCardModal', () => {
  const defaultProps = {
    isModalActive: true,
    toggleModal: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseEntity.mockReturnValue({
      entity: mockEntityWithTerm,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });
    mockUseToast.mockImplementation(() => ({ makeToast: jest.fn() }) as any);
    mockGetMerchant.mockResolvedValue(mockMerchant);
    mockGetApprovedTerms.mockResolvedValue({ terms: mockTerms } as any);
    mockUpdateRechargeTerm.mockResolvedValue({} as any);
  });

  test('renders the Manage Card modal with billing info', async () => {
    customRender(<ManageCardModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Manage Card')).toBeInTheDocument();
      expect(screen.getByText('Card Billing Information')).toBeInTheDocument();
    });
  });

  test('shows loading state while merchant is being fetched', () => {
    mockGetMerchant.mockImplementation(() => new Promise(() => {}));

    customRender(<ManageCardModal {...defaultProps} />);

    expect(screen.getByText('Default Term for Card Purchases')).toBeInTheDocument();
  });

  test('shows Edit Default Term button after terms load', async () => {
    customRender(<ManageCardModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Edit Default Term')).toBeInTheDocument();
    });
  });

  test('opens edit term modal with term options when Edit Default Term is clicked', async () => {
    customRender(<ManageCardModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Edit Default Term')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit Default Term'));

    await waitFor(() => {
      expect(screen.getByText('Edit Default Terms')).toBeInTheDocument();
      expect(screen.getByText('Adjust Number of Months')).toBeInTheDocument();
    });
  });

  test('does not show infinite loading spinner in edit term modal when allMerchants is not provided', async () => {
    customRender(<ManageCardModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Edit Default Term')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit Default Term'));

    await waitFor(() => {
      expect(screen.getByText('Adjust Number of Months')).toBeInTheDocument();
      expect(screen.getByLabelText('save-default-terms-button')).toBeInTheDocument();
    });
  });

  test('shows error message when merchant data fails to load', async () => {
    mockGetMerchant.mockRejectedValue(new Error('Network error'));

    customRender(<ManageCardModal {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Error loading default term settings')).toBeInTheDocument();
    });
  });
});
