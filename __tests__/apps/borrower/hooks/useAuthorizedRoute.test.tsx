import { renderHook } from '@testing-library/react';
import { useRouter } from 'next/router';

import useAuthorizedRoute from '@apps/borrower/hooks/useAuthorizedRoute';
import { useEntity } from '@contexts/EntityContext';

jest.mock('@contexts/EntityContext');
jest.mock('next/router');

let mockPlusEnabled = true;
jest.mock('@lib/constants/SiteVariables', () => ({
  ...jest.requireActual('@lib/constants/SiteVariables'),
  get plusEnabled() {
    return mockPlusEnabled;
  },
}));

const mockUseEntity = useEntity as jest.MockedFunction<typeof useEntity>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

const baseEntity = {
  underwriting_status: 'approved',
  isNetX: false,
  isAmazonExclusive: false,
  vc_enabled: false,
  plus_enabled: false,
};

describe('useAuthorizedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPlusEnabled = true;
  });

  describe('/plus route', () => {
    beforeEach(() => {
      mockUseRouter.mockReturnValue({ asPath: '/plus' } as any);
    });

    test('allows access for approved non-NETX borrower when plusEnabled is true', () => {
      mockUseEntity.mockReturnValue({
        entity: { ...baseEntity, underwriting_status: 'approved', isNetX: false } as any,
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: false,
      });

      const { result } = renderHook(() => useAuthorizedRoute());
      expect(result.current.isAuthorized).toBe(true);
    });

    test('denies access for Amazon-exclusive borrower', () => {
      mockUseEntity.mockReturnValue({
        entity: { ...baseEntity, underwriting_status: 'approved', isAmazonExclusive: true } as any,
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: false,
      });

      const { result } = renderHook(() => useAuthorizedRoute());
      expect(result.current.isAuthorized).toBe(false);
    });

    test('denies access for NETX borrower', () => {
      mockUseEntity.mockReturnValue({
        entity: { ...baseEntity, underwriting_status: 'approved', isNetX: true } as any,
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: false,
      });

      const { result } = renderHook(() => useAuthorizedRoute());
      expect(result.current.isAuthorized).toBe(false);
    });

    test('denies access for non-approved borrower', () => {
      mockUseEntity.mockReturnValue({
        entity: { ...baseEntity, underwriting_status: 'pending', isNetX: false } as any,
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: false,
      });

      const { result } = renderHook(() => useAuthorizedRoute());
      expect(result.current.isAuthorized).toBe(false);
    });

    test('denies access when plusEnabled feature flag is off', () => {
      mockPlusEnabled = false;

      mockUseEntity.mockReturnValue({
        entity: { ...baseEntity, underwriting_status: 'approved', isNetX: false } as any,
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: false,
      });

      const { result } = renderHook(() => useAuthorizedRoute());
      expect(result.current.isAuthorized).toBe(false);
    });

    test('allows access while entity is loading', () => {
      mockUseEntity.mockReturnValue({
        entity: null,
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: true,
      });

      const { result } = renderHook(() => useAuthorizedRoute());
      expect(result.current.isAuthorized).toBe(true);
    });
  });

  describe('/wallet route', () => {
    beforeEach(() => {
      mockUseRouter.mockReturnValue({ asPath: '/wallet' } as any);
    });

    test('allows access when vc_enabled', () => {
      mockUseEntity.mockReturnValue({
        entity: { ...baseEntity, vc_enabled: true } as any,
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: false,
      });

      const { result } = renderHook(() => useAuthorizedRoute());
      expect(result.current.isAuthorized).toBe(true);
    });

    test('denies access when vc_enabled is false', () => {
      mockUseEntity.mockReturnValue({
        entity: { ...baseEntity, vc_enabled: false } as any,
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: false,
      });

      const { result } = renderHook(() => useAuthorizedRoute());
      expect(result.current.isAuthorized).toBe(false);
    });
  });

  describe('other routes', () => {
    test('allows access for all other routes', () => {
      mockUseRouter.mockReturnValue({ asPath: '/orders' } as any);
      mockUseEntity.mockReturnValue({
        entity: { ...baseEntity } as any,
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: false,
      });

      const { result } = renderHook(() => useAuthorizedRoute());
      expect(result.current.isAuthorized).toBe(true);
    });
  });
});
