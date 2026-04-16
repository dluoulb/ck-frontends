/* eslint-disable @next/next/no-img-element */

import Widgets from '@apps/borrower/components/home/widgets';
import useCompanyPhysicalCard from '@apps/borrower/hooks/useCompanyPhysicalCard';
import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import CompanyRecord from '@lib/records/company';
import { companyAmazonExclusive, companyApproved } from '@lib/testing/records';
import { customRender, fireEvent, screen } from '@lib/testing/test-utils';

jest.mock('@apps/borrower/hooks/useCompanyPhysicalCard');
jest.mock('@apps/borrower/hooks/useCompanyVirtualCard');
jest.mock(
  '@apps/borrower/components/home/widgets/virtual_cards/vc_modal/MultiUseVirtualCardModalWrapper',
  () => ({
    __esModule: true,
    default: ({ isModalActive }) =>
      isModalActive ? <div data-testid="dashboard-activation-modal" /> : null,
  }),
);
jest.mock('next/script', () => () => null);
jest.mock('next/image', () => {
  const MockImage = ({ alt = '', ...props }) => <img alt={alt} {...props} />;
  MockImage.displayName = 'MockImage';
  return MockImage;
});

const mockUseCompanyPhysicalCard = useCompanyPhysicalCard as jest.MockedFunction<
  typeof useCompanyPhysicalCard
>;
const mockUseCompanyVirtualCard = useCompanyVirtualCard as jest.MockedFunction<
  typeof useCompanyVirtualCard
>;

const activeVirtualCard = {
  id: 'vc-1',
  type: 'VIRTUAL',
  status: 'ACTIVE',
  is_default: true,
  last_four: '1234',
};

const defaultPhysicalCardProps = {
  physicalCard: null,
  physicalCardError: null,
  physicalCardLoading: false,
  physicalCardRefetching: false,
  refetchPhysicalCard: jest.fn(),
};

describe('Widgets Index', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCompanyVirtualCard.mockReturnValue({
      virtualCard: null,
      virtualCardError: null,
      virtualCardLoading: false,
      virtualCardRefetching: false,
      refetchVirtualCard: jest.fn(),
    });
    mockUseCompanyPhysicalCard.mockReturnValue(defaultPhysicalCardProps);
  });

  test('renders all widgets', async () => {
    customRender(<Widgets />, { withBorrowerProviders: true });

    const widgets = screen.getAllByRole('base-grid-item-component');
    expect(widgets).toHaveLength(5);
  });

  test('keeps the dashboard activation modal open when the VC widget swaps out', () => {
    let entity = new CompanyRecord({
      ...companyApproved,
      cta_banners: [{ name: 'multi_use_virtual_card', enabled: true }],
    });
    let currentVirtualCardProps = {
      virtualCard: null,
      virtualCardError: null,
      virtualCardLoading: false,
      virtualCardRefetching: false,
      refetchVirtualCard: jest.fn(),
    };

    global.mockedUseEntity.mockImplementation(() => ({
      entity,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));
    mockUseCompanyVirtualCard.mockImplementation(() => currentVirtualCardProps as any);

    const { rerender } = customRender(<Widgets />, { withBorrowerProviders: true });

    fireEvent.click(screen.getByText('Activate Virtual Card Instantly'));

    expect(screen.getByTestId('dashboard-activation-modal')).toBeInTheDocument();

    entity = new CompanyRecord({
      ...companyApproved,
      cta_banners: [],
    });
    currentVirtualCardProps = {
      ...currentVirtualCardProps,
      virtualCard: activeVirtualCard,
    };
    global.mockedUseEntity.mockImplementation(() => ({
      entity,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));

    rerender(<Widgets />);

    expect(screen.getByTestId('dashboard-activation-modal')).toBeInTheDocument();
  });

  describe('AmazonExclusive test group', () => {
    beforeEach(() => {
      global.mockedUseEntity.mockImplementation(() => ({
        entity: companyAmazonExclusive,
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: false,
      }));
    });

    test('hides Browse Merchants (MarketplaceLink) widget', () => {
      customRender(<Widgets />, { withBorrowerProviders: true });

      expect(screen.queryByText('Browse Merchants')).not.toBeInTheDocument();
    });

    test('hides Upload Invoice (CkaLink) widget', () => {
      customRender(<Widgets />, { withBorrowerProviders: true });

      expect(screen.queryByText('Upload Invoice')).not.toBeInTheDocument();
    });

    test('renders fewer widgets without marketplace and CKA links', () => {
      customRender(<Widgets />, { withBorrowerProviders: true });

      const widgets = screen.getAllByRole('base-grid-item-component');
      expect(widgets).toHaveLength(3);
    });

    test('does not show marketplace and CKA links while entity is loading', () => {
      global.mockedUseEntity.mockImplementation(() => ({
        entity: null,
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: true,
      }));

      customRender(<Widgets />, { withBorrowerProviders: true });

      expect(screen.queryByText('Browse Merchants')).not.toBeInTheDocument();
      expect(screen.queryByText('Upload Invoice')).not.toBeInTheDocument();
    });
  });
});
