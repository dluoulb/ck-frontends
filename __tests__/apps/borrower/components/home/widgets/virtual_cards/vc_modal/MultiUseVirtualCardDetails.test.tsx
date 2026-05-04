/* eslint-disable @next/next/no-img-element */

import React from 'react';

import MultiUseVirtualCardDetails from '@apps/borrower/components/home/widgets/virtual_cards/vc_modal/MultiUseVirtualCardDetails';
import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import CompanyVirtualCardRecord from '@lib/records/company_virtual_card';
import { customRender, screen } from '@lib/testing/test-utils';

jest.mock('@apps/borrower/hooks/useCompanyVirtualCard');
jest.mock('next/image', () => {
  const MockImage = ({ alt = '', ...props }) => <img alt={alt} {...props} />;
  MockImage.displayName = 'MockImage';
  return MockImage;
});
jest.mock('next/script', () => () => null);
jest.mock('@apps/borrower/hooks/useQoloWidget', () => ({
  __esModule: true,
  default: jest.fn(() => ({ iframeReady: false, onWidgetSuccess: jest.fn() })),
}));
jest.mock('@hooks/useModal', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isModalActive: false,
    toggleModal: jest.fn(),
    modalState: {},
    setModalState: jest.fn(),
    resetModalState: jest.fn(),
  })),
}));
jest.mock('@contexts/BorrowerContext', () => ({
  ...jest.requireActual('@contexts/BorrowerContext'),
  useBorrowerDeps: jest.fn().mockReturnValue({
    refetchPaymentMethods: jest.fn(),
    defaultTermSettings: [],
  }),
}));
jest.mock('@contexts/EntityContext', () => ({
  useEntity: jest.fn().mockReturnValue({
    entity: {
      id: 'entity-1',
      vc_sub_limits: { limit_amount: '5000', remaining_limit_amount: '5000' },
    },
    fetchEntity: jest.fn(),
    entityLoading: false,
    entityError: null,
  }),
}));

const mockUseCompanyVirtualCard = useCompanyVirtualCard as jest.MockedFunction<
  typeof useCompanyVirtualCard
>;

const activeCard = new CompanyVirtualCardRecord({
  id: 'vc-1',
  type: 'VIRTUAL',
  status: 'ACTIVE',
  is_default: true,
  last_four: '1234',
});

const baseVirtualCardProps = {
  virtualCard: null,
  virtualCardError: null,
  virtualCardLoading: false,
  virtualCardRefetching: false,
  refetchVirtualCard: jest.fn(),
};

describe('MultiUseVirtualCardDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCompanyVirtualCard.mockReturnValue({ ...baseVirtualCardProps });
  });

  describe('card display from hook data', () => {
    test('shows Active badge when card is active via hook', () => {
      mockUseCompanyVirtualCard.mockReturnValue({
        ...baseVirtualCardProps,
        virtualCard: activeCard,
      });

      customRender(<MultiUseVirtualCardDetails />, { withBorrowerProviders: true });

      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    test('shows inactive card section when card is not active', () => {
      customRender(<MultiUseVirtualCardDetails />, { withBorrowerProviders: true });

      expect(screen.getByText('Credit Key Virtual Card')).toBeInTheDocument();
    });
  });

  describe('card display from modalState fallback', () => {
    test('shows active card from modalState when hook has no active card', () => {
      customRender(<MultiUseVirtualCardDetails modalState={{ virtual_card: activeCard }} />, {
        withBorrowerProviders: true,
      });

      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    test('shows the selected default term from modalState during activation flow', () => {
      customRender(
        <MultiUseVirtualCardDetails
          modalState={{
            virtual_card: activeCard,
            default_term_setting: {
              merchant_slug: 'virtual',
              default_term: {
                term: 12,
                term_period: 'monthly',
              },
            },
          }}
        />,
        { withBorrowerProviders: true },
      );

      expect(screen.getByText('12 months')).toBeInTheDocument();
    });

    test('shows the newly-created modal card instead of the inactive activation sections', () => {
      const pendingCard = new CompanyVirtualCardRecord({
        id: 'vc-2',
        type: 'VIRTUAL',
        status: 'PENDING',
        is_default: true,
        last_four: '5678',
      });

      customRender(<MultiUseVirtualCardDetails modalState={{ virtual_card: pendingCard }} />, {
        withBorrowerProviders: true,
      });

      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('View Card Info')).toBeInTheDocument();
      expect(screen.queryByText('Activate Your Credit Key Virtual Card')).not.toBeInTheDocument();
      expect(screen.queryByText('Activate Virtual Card Instantly')).not.toBeInTheDocument();
    });
  });
});
