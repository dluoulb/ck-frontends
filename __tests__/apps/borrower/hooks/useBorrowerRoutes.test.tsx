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

  test('hides Plus+ tab when entity does not have plus_enabled', () => {
    mockUseEntity.mockReturnValue({
      entity: {
        vc_enabled: false,
        plus_enabled: false,
        isAmazonExclusive: true,
        isNetX: false,
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

  test('hides Plus+ tab by default for a regular borrower without plus_enabled', () => {
    mockUseEntity.mockReturnValue({
      entity: {
        vc_enabled: false,
        plus_enabled: false,
        isAmazonExclusive: false,
        isNetX: false,
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
        isNetX: false,
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

  test('shows Plus+ but hides Rewards for non-approved entity', () => {
    mockUseEntity.mockReturnValue({
      entity: {
        vc_enabled: false,
        plus_enabled: true,
        isAmazonExclusive: false,
        isNetX: false,
        underwriting_status: 'pending',
      },
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });

    const { result: primaryResult } = renderHook(() => usePrimaryRoutes());
    const { result: secondaryResult } = renderHook(() => useSecondaryRoutes());

    expect(primaryResult.current.primaryRoutes.map((route) => route.name)).toContain('Plus+');
    expect(primaryResult.current.primaryRoutes.map((route) => route.name)).not.toContain('Rewards');

    const leftItems =
      secondaryResult.current.secondaryRoutes.find((section) => section.section === 'left')
        ?.items || [];
    expect(leftItems.map((item) => item.name)).toContain('Plus+');

    const rightItems =
      secondaryResult.current.secondaryRoutes.find((section) => section.section === 'right')
        ?.items || [];
    expect(rightItems.map((item) => item.name)).not.toContain('Reward Points');
  });

  test('hides Plus+ tab for non-NetX entity when plus_enabled is false', () => {
    mockUseEntity.mockReturnValue({
      entity: {
        vc_enabled: false,
        plus_enabled: false,
        isAmazonExclusive: false,
        isNetX: false,
        underwriting_status: 'pending',
      },
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });

    const { result: primaryResult } = renderHook(() => usePrimaryRoutes());
    const { result: secondaryResult } = renderHook(() => useSecondaryRoutes());

    expect(primaryResult.current.primaryRoutes.map((route) => route.name)).not.toContain('Plus+');
    expect(primaryResult.current.primaryRoutes.map((route) => route.name)).not.toContain('Rewards');

    const leftItems =
      secondaryResult.current.secondaryRoutes.find((section) => section.section === 'left')
        ?.items || [];
    expect(leftItems.map((item) => item.name)).not.toContain('Plus+');
  });

  test('hides Rewards for Amazon-exclusive entity even if approved', () => {
    mockUseEntity.mockReturnValue({
      entity: {
        vc_enabled: false,
        plus_enabled: false,
        isAmazonExclusive: true,
        isNetX: false,
        underwriting_status: 'approved',
      },
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });

    const { result: primaryResult } = renderHook(() => usePrimaryRoutes());
    const { result: secondaryResult } = renderHook(() => useSecondaryRoutes());

    expect(primaryResult.current.primaryRoutes.map((route) => route.name)).not.toContain('Rewards');

    const rightItems =
      secondaryResult.current.secondaryRoutes.find((section) => section.section === 'right')
        ?.items || [];
    expect(rightItems.map((item) => item.name)).not.toContain('Reward Points');
  });

  test('hides Rewards for NetX entity even if approved', () => {
    mockUseEntity.mockReturnValue({
      entity: {
        vc_enabled: false,
        plus_enabled: false,
        isAmazonExclusive: false,
        isNetX: true,
        underwriting_status: 'approved',
      },
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });

    const { result: primaryResult } = renderHook(() => usePrimaryRoutes());
    const { result: secondaryResult } = renderHook(() => useSecondaryRoutes());

    expect(primaryResult.current.primaryRoutes.map((route) => route.name)).not.toContain('Rewards');

    const rightItems =
      secondaryResult.current.secondaryRoutes.find((section) => section.section === 'right')
        ?.items || [];
    expect(rightItems.map((item) => item.name)).not.toContain('Reward Points');
  });

  test('shows Rewards for approved non-Amazon-exclusive, non-NetX entity', () => {
    mockUseEntity.mockReturnValue({
      entity: {
        vc_enabled: false,
        plus_enabled: true,
        isAmazonExclusive: false,
        isNetX: false,
        underwriting_status: 'approved',
      },
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });

    const { result: primaryResult } = renderHook(() => usePrimaryRoutes());
    const { result: secondaryResult } = renderHook(() => useSecondaryRoutes());

    expect(primaryResult.current.primaryRoutes.map((route) => route.name)).toContain('Rewards');

    const rightItems =
      secondaryResult.current.secondaryRoutes.find((section) => section.section === 'right')
        ?.items || [];
    expect(rightItems.map((item) => item.name)).toContain('Reward Points');
  });

  test('shows Rewards for hold entity', () => {
    mockUseEntity.mockReturnValue({
      entity: {
        vc_enabled: false,
        plus_enabled: false,
        isAmazonExclusive: false,
        isNetX: false,
        underwriting_status: 'hold',
      },
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });

    const { result: primaryResult } = renderHook(() => usePrimaryRoutes());
    const { result: secondaryResult } = renderHook(() => useSecondaryRoutes());

    expect(primaryResult.current.primaryRoutes.map((route) => route.name)).toContain('Rewards');

    const rightItems =
      secondaryResult.current.secondaryRoutes.find((section) => section.section === 'right')
        ?.items || [];
    expect(rightItems.map((item) => item.name)).toContain('Reward Points');
  });

  test('shows Rewards for declined entity', () => {
    mockUseEntity.mockReturnValue({
      entity: {
        vc_enabled: false,
        plus_enabled: false,
        isAmazonExclusive: false,
        isNetX: false,
        underwriting_status: 'declined',
      },
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });

    const { result: primaryResult } = renderHook(() => usePrimaryRoutes());
    const { result: secondaryResult } = renderHook(() => useSecondaryRoutes());

    expect(primaryResult.current.primaryRoutes.map((route) => route.name)).toContain('Rewards');

    const rightItems =
      secondaryResult.current.secondaryRoutes.find((section) => section.section === 'right')
        ?.items || [];
    expect(rightItems.map((item) => item.name)).toContain('Reward Points');
  });
});
