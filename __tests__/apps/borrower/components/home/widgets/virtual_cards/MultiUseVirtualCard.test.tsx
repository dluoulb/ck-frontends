import MultiUseVirtualCard from '@apps/borrower/components/home/widgets/virtual_cards/MultiUseVirtualCard';
import useCompanyPhysicalCard from '@apps/borrower/hooks/useCompanyPhysicalCard';
import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import { useEntity } from '@contexts/EntityContext';
import { amazonPhysicalCardTest } from '@lib/constants/SiteVariables';
import CompanyRecord from '@lib/records/company';
import { companyApproved } from '@lib/testing/records';
import { customRender, screen } from '@lib/testing/test-utils';

jest.mock('@contexts/EntityContext');
jest.mock('@apps/borrower/hooks/useCompanyPhysicalCard');
jest.mock('@apps/borrower/hooks/useCompanyVirtualCard');
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

describe('MultiUseVirtualCard - Physical Card Presentment', () => {
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

    customRender(<MultiUseVirtualCard />);

    expect(screen.getByText('Credit Key Physical Card')).toBeInTheDocument();
  });

  test('hides physical card section when borrower is in Amazon test group and flag is enabled', () => {
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

    customRender(<MultiUseVirtualCard />);

    expect(screen.queryByText('Credit Key Physical Card')).not.toBeInTheDocument();
  });

  test('shows physical card section for Amazon cohort when feature flag is disabled', () => {
    const entity = makeEntity({
      [amazonPhysicalCardTest.type]: amazonPhysicalCardTest.cohort,
    });
    jest.spyOn(entity, 'physical_card_enabled' as any, 'get').mockReturnValue(true);

    mockUseEntity.mockReturnValue({
      entity,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });
    mockUseCompanyVirtualCard.mockReturnValue(defaultVirtualCardProps);
    mockUseCompanyPhysicalCard.mockReturnValue(defaultPhysicalCardProps);

    customRender(<MultiUseVirtualCard />);

    expect(screen.getByText('Credit Key Physical Card')).toBeInTheDocument();
  });

  test('hides physical card section when physical card already exists', () => {
    mockUseEntity.mockReturnValue({
      entity: makeEntity({}),
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });
    mockUseCompanyVirtualCard.mockReturnValue(defaultVirtualCardProps);
    mockUseCompanyPhysicalCard.mockReturnValue({
      ...defaultPhysicalCardProps,
      physicalCard: { id: 'pc-1', type: 'PHYSICAL', status: 'ACTIVE', last_four: '5678' },
    });

    customRender(<MultiUseVirtualCard />);

    expect(screen.queryByText('Credit Key Physical Card')).not.toBeInTheDocument();
  });
});
