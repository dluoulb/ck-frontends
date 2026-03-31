import { renderHook } from '@testing-library/react';

import usePrimaryRoutes from '@apps/borrower/hooks/usePrimaryRoutes';
import useSecondaryRoutes from '@apps/borrower/hooks/useSecondaryRoutes';
import { useEntity } from '@contexts/EntityContext';

jest.mock('@contexts/EntityContext');
jest.mock('@lib/actions/marketplace', () => ({
  marketplace: {
    url: '/discover',
    enabled: true,
  },
}));

const mockUseEntity = useEntity as jest.MockedFunction<typeof useEntity>;

describe('Borrower route hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('mobileApp', 'false');
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
});
