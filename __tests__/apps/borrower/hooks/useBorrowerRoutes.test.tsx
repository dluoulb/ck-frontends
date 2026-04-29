import { renderHook } from '@testing-library/react';

import usePrimaryRoutes from '@apps/borrower/hooks/usePrimaryRoutes';
import useSecondaryRoutes from '@apps/borrower/hooks/useSecondaryRoutes';
import { useEntity } from '@contexts/EntityContext';
import { useActiveSubscription } from '@hooks/useSubscription';

jest.mock('@contexts/EntityContext');
jest.mock('@hooks/useSubscription');
jest.mock('@lib/actions/marketplace', () => ({
  marketplace: {
    url: '/discover',
    enabled: true,
  },
}));

const mockUseEntity = useEntity as jest.MockedFunction<typeof useEntity>;
const mockUseActiveSubscription = useActiveSubscription as jest.MockedFunction<
  typeof useActiveSubscription
>;

describe('Borrower route hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('mobileApp', 'false');
    mockUseActiveSubscription.mockReturnValue({
      activeSubscription: undefined,
      activeSubscriptionError: null,
      activeSubscriptionLoading: false,
      refetchActiveSubscription: jest.fn(),
    });
  });

  test('hides Discover route while entity is loading', () => {
    mockUseEntity.mockReturnValue({
      entity: null,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: true,
    });

    const { result: primaryResult } = renderHook(() => usePrimaryRoutes());
    const { result: secondaryResult } = renderHook(() => useSecondaryRoutes());

    expect(primaryResult.current.primaryRoutes.map((route) => route.name)).not.toContain(
      'Discover',
    );

    const leftItems =
      secondaryResult.current.secondaryRoutes.find((section) => section.section === 'left')
        ?.items || [];
    expect(leftItems.map((item) => item.name)).not.toContain('Discover');
  });

  test('shows Discover route when entity has loaded and is not Amazon-exclusive', () => {
    mockUseEntity.mockReturnValue({
      entity: {
        vc_enabled: true,
        plus_enabled: false,
        isAmazonExclusive: false,
      },
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });

    const { result: primaryResult } = renderHook(() => usePrimaryRoutes());
    const { result: secondaryResult } = renderHook(() => useSecondaryRoutes());

    expect(primaryResult.current.primaryRoutes.map((route) => route.name)).toContain('Discover');

    const leftItems =
      secondaryResult.current.secondaryRoutes.find((section) => section.section === 'left')
        ?.items || [];
    expect(leftItems.map((item) => item.name)).toContain('Discover');
  });

  test('hides Plus+ tab when entity does not have plus_enabled', () => {
    mockUseEntity.mockReturnValue({
      entity: {
        vc_enabled: false,
        plus_enabled: false,
        isAmazonExclusive: false,
      },
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });

    const { result: primaryResult } = renderHook(() => usePrimaryRoutes());
    const { result: secondaryResult } = renderHook(() => useSecondaryRoutes());

    expect(primaryResult.current.primaryRoutes.map((route) => route.name)).not.toContain('Plus+');

    const leftItems =
      secondaryResult.current.secondaryRoutes.find((section) => section.section === 'left')
        ?.items || [];
    expect(leftItems.map((item) => item.name)).not.toContain('Plus+');
  });

  test('shows Plus+ tab when entity has plus_enabled', () => {
    mockUseEntity.mockReturnValue({
      entity: {
        vc_enabled: false,
        plus_enabled: true,
        isAmazonExclusive: false,
      },
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });

    const { result: primaryResult } = renderHook(() => usePrimaryRoutes());
    const { result: secondaryResult } = renderHook(() => useSecondaryRoutes());

    expect(primaryResult.current.primaryRoutes.map((route) => route.name)).toContain('Plus+');

    const leftItems =
      secondaryResult.current.secondaryRoutes.find((section) => section.section === 'left')
        ?.items || [];
    expect(leftItems.map((item) => item.name)).toContain('Plus+');
  });

  test('shows Plus+ tab when entity has an active subscription but is not in the test group', () => {
    mockUseEntity.mockReturnValue({
      entity: {
        id: 'company-1',
        vc_enabled: false,
        plus_enabled: false,
        isAmazonExclusive: false,
      },
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });
    mockUseActiveSubscription.mockReturnValue({
      activeSubscription: { id: 'sub-1', status: 'ACTIVE' } as any,
      activeSubscriptionError: null,
      activeSubscriptionLoading: false,
      refetchActiveSubscription: jest.fn(),
    });

    const { result: primaryResult } = renderHook(() => usePrimaryRoutes());
    const { result: secondaryResult } = renderHook(() => useSecondaryRoutes());

    expect(primaryResult.current.primaryRoutes.map((route) => route.name)).toContain('Plus+');

    const leftItems =
      secondaryResult.current.secondaryRoutes.find((section) => section.section === 'left')
        ?.items || [];
    expect(leftItems.map((item) => item.name)).toContain('Plus+');
  });
});
