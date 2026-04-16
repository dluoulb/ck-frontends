/* eslint-disable @next/next/no-img-element */

import Wallet from '@apps/borrower/components/wallet/index';
import useCompanyPhysicalCard from '@apps/borrower/hooks/useCompanyPhysicalCard';
import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import { useEntity } from '@contexts/EntityContext';
import { amazonPhysicalCardTest } from '@lib/constants/SiteVariables';
import CompanyRecord from '@lib/records/company';
import { companyApproved } from '@lib/testing/records';
import { customRender, fireEvent, screen } from '@lib/testing/test-utils';

jest.mock('@contexts/EntityContext');
jest.mock('@contexts/BorrowerContext', () => ({
  ...jest.requireActual('@contexts/BorrowerContext'),
  useBorrowerDeps: jest.fn().mockReturnValue({ defaultTermSettings: [] }),
}));
jest.mock('@apps/borrower/hooks/useCompanyPhysicalCard');
jest.mock('@apps/borrower/hooks/useCompanyVirtualCard');
jest.mock(
  '@apps/borrower/components/home/widgets/virtual_cards/vc_modal/MultiUseVirtualCardModalWrapper',
  () => ({
    __esModule: true,
    default: ({ isModalActive }) =>
      isModalActive ? <div data-testid="wallet-activation-modal" /> : null,
  }),
);
jest.mock('@apps/borrower/hooks/usePendingAuthorizations', () =>
  jest.fn().mockReturnValue({ pendingAuths: null, pendingAuthsLoading: false }),
);
jest.mock('next/image', () => {
  const MockImage = ({ alt = '', ...props }) => <img alt={alt} {...props} />;
  MockImage.displayName = 'MockImage';
  return MockImage;
});
jest.mock('next/script', () => () => null);

const mockUseEntity = useEntity as jest.MockedFunction<typeof useEntity>;
const mockUseCompanyPhysicalCard = useCompanyPhysicalCard as jest.MockedFunction<
  typeof useCompanyPhysicalCard
>;
const mockUseCompanyVirtualCard = useCompanyVirtualCard as jest.MockedFunction<
  typeof useCompanyVirtualCard
>;

const makeEntity = (activeCohortsByType: Record<string, string>) =>
  new CompanyRecord({ ...companyApproved, active_cohorts_by_type: activeCohortsByType });

const activeVirtualCard = {
  id: 'vc-1',
  type: 'VIRTUAL',
  status: 'ACTIVE',
  is_default: true,
  last_four: '1234',
};

const defaultVirtualCardProps = {
  virtualCard: activeVirtualCard,
  virtualCardError: null,
  virtualCardLoading: false,
  virtualCardRefetching: false,
  refetchVirtualCard: jest.fn(),
};

const defaultPhysicalCardProps = {
  physicalCard: null,
  physicalCardError: null,
  physicalCardLoading: false,
  physicalCardRefetching: false,
  refetchPhysicalCard: jest.fn(),
};

describe('Wallet - Physical Card Visibility', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('shows physical card section when borrower is not in Amazon test group', () => {
    mockUseEntity.mockReturnValue({
      entity: makeEntity({}),
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });
    mockUseCompanyVirtualCard.mockReturnValue(defaultVirtualCardProps);
    mockUseCompanyPhysicalCard.mockReturnValue(defaultPhysicalCardProps);

    customRender(<Wallet />);

    expect(screen.getByText('Credit Key Physical Card')).toBeInTheDocument();
  });

  test('hides physical card section when borrower is in Amazon test group', () => {
    const entity = makeEntity({
      [amazonPhysicalCardTest.type]: amazonPhysicalCardTest.cohort,
    });
    jest.spyOn(entity, 'physical_card_enabled' as any, 'get').mockReturnValue(false);

    mockUseEntity.mockReturnValue({
      entity,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });
    mockUseCompanyVirtualCard.mockReturnValue(defaultVirtualCardProps);
    mockUseCompanyPhysicalCard.mockReturnValue(defaultPhysicalCardProps);

    customRender(<Wallet />);

    expect(screen.queryByText('Credit Key Physical Card')).not.toBeInTheDocument();
  });

  test('still shows virtual card section when physical card is hidden', () => {
    const entity = makeEntity({
      [amazonPhysicalCardTest.type]: amazonPhysicalCardTest.cohort,
    });
    jest.spyOn(entity, 'physical_card_enabled' as any, 'get').mockReturnValue(false);

    mockUseEntity.mockReturnValue({
      entity,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });
    mockUseCompanyVirtualCard.mockReturnValue(defaultVirtualCardProps);
    mockUseCompanyPhysicalCard.mockReturnValue(defaultPhysicalCardProps);

    customRender(<Wallet />);

    expect(screen.getByText('Credit Key Virtual Card')).toBeInTheDocument();
    expect(screen.queryByText('Credit Key Physical Card')).not.toBeInTheDocument();
  });

  test('does not render physical card section while entity is loading', () => {
    mockUseEntity.mockReturnValue({
      entity: null,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: true,
    });
    mockUseCompanyVirtualCard.mockReturnValue(defaultVirtualCardProps);
    mockUseCompanyPhysicalCard.mockReturnValue(defaultPhysicalCardProps);

    customRender(<Wallet />);

    expect(screen.queryByText('Credit Key Physical Card')).not.toBeInTheDocument();
  });

  test('keeps the activation modal open when the virtual card becomes active', () => {
    mockUseEntity.mockReturnValue({
      entity: makeEntity({}),
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });

    let currentVirtualCardProps = {
      ...defaultVirtualCardProps,
      virtualCard: null,
    };

    mockUseCompanyVirtualCard.mockImplementation(() => currentVirtualCardProps as any);
    mockUseCompanyPhysicalCard.mockReturnValue(defaultPhysicalCardProps);

    const { rerender } = customRender(<Wallet />);

    fireEvent.click(screen.getByText('Activate Virtual Card Instantly'));

    expect(screen.getByTestId('wallet-activation-modal')).toBeInTheDocument();

    currentVirtualCardProps = defaultVirtualCardProps;
    rerender(<Wallet />);

    expect(screen.getByTestId('wallet-activation-modal')).toBeInTheDocument();
  });
});
