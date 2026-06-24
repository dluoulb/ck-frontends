import { renderHook } from '@testing-library/react';
import { useRouter } from 'next/router';

import useAuthorizedRoute from '@apps/borrower/hooks/useAuthorizedRoute';
import { useEntity } from '@contexts/EntityContext';

jest.mock('@contexts/EntityContext');
jest.mock('next/router');

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
  });

  describe('/plus route', () => {
    beforeEach(() => {
      mockUseRouter.mockReturnValue({ pathname: '/plus' } as any);
    });

    test('allows access when entity.plus_enabled is true', () => {
      mockUseEntity.mockReturnValue({
        entity: { ...baseEntity, plus_enabled: true } as any,
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: false,
      });

      const { result } = renderHook(() => useAuthorizedRoute());
      expect(result.current.isAuthorized).toBe(true);
    });

    test('denies access when entity.plus_enabled is false', () => {
      mockUseEntity.mockReturnValue({
        entity: { ...baseEntity, plus_enabled: false } as any,
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: false,
      });

      const { result } = renderHook(() => useAuthorizedRoute());
      expect(result.current.isAuthorized).toBe(false);
    });

    test('denies access when entity is null and not loading', () => {
      mockUseEntity.mockReturnValue({
        entity: null,
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

    test('allows access for borrower-prefixed plus pathname when plus is enabled', () => {
      mockUseRouter.mockReturnValue({ pathname: '/borrower/plus' } as any);
      mockUseEntity.mockReturnValue({
        entity: { ...baseEntity, plus_enabled: true } as any,
        setEntity: jest.fn(),
        fetchEntity: jest.fn(),
        entityError: null,
        entityLoading: false,
      });

      const { result } = renderHook(() => useAuthorizedRoute());
      expect(result.current.isAuthorized).toBe(true);
    });
  });

  describe('/wallet route', () => {
    beforeEach(() => {
      mockUseRouter.mockReturnValue({ pathname: '/wallet' } as any);
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

    test('allows access for borrower-prefixed wallet pathname when vc_enabled is true', () => {
      mockUseRouter.mockReturnValue({ pathname: '/borrower/wallet' } as any);
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

    test('denies access for borrower-prefixed wallet pathname when vc_enabled is false', () => {
      mockUseRouter.mockReturnValue({ pathname: '/borrower/wallet' } as any);
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
      mockUseRouter.mockReturnValue({ pathname: '/orders' } as any);
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
