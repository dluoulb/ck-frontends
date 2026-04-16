import { useQuery } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';

import useCompanyPhysicalCard from '@apps/borrower/hooks/useCompanyPhysicalCard';
import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import { useUser } from '@contexts/UserContext';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));
jest.mock('@contexts/UserContext', () => ({
  ...jest.requireActual('@contexts/UserContext'),
  useUser: jest.fn(),
}));
jest.mock('@hooks/useApi', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));

const mockUseQuery = useQuery as jest.MockedFunction<typeof useQuery>;
const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;

describe('company card hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseUser.mockReturnValue({ user: { company_id: 'company-1' } } as any);
    mockUseQuery.mockReturnValue({
      data: [
        { id: 'vc-1', type: 'VIRTUAL', is_default: true },
        { id: 'pc-1', type: 'PHYSICAL', status: 'PENDING' },
      ] as any,
      error: null,
      isLoading: false,
      isRefetching: false,
      refetch: jest.fn(),
    } as any);
  });

  test('shares the same company cards query key across virtual and physical card hooks', () => {
    const { result } = renderHook(() => ({
      virtual: useCompanyVirtualCard(),
      physical: useCompanyPhysicalCard(),
    }));

    expect(result.current.virtual.virtualCard?.id).toBe('vc-1');
    expect(result.current.physical.physicalCard?.id).toBe('pc-1');

    const firstCall = mockUseQuery.mock.calls[0][0];
    const secondCall = mockUseQuery.mock.calls[1][0];
    const refetchOnMount = firstCall.refetchOnMount as (query: {
      state: { status: string };
    }) => boolean;
    const retry = firstCall.retry as (failureCount: number, error: any) => boolean;

    expect(firstCall.queryKey).toEqual(['company_cards', 'company-1']);
    expect(secondCall.queryKey).toEqual(['company_cards', 'company-1']);
    expect(firstCall.staleTime).toBe(5 * 60 * 1000);
    expect(refetchOnMount({ state: { status: 'error' } })).toBe(true);
    expect(refetchOnMount({ state: { status: 'success' } })).toBe(false);
    expect(firstCall.refetchOnWindowFocus).toBe(false);
    expect(firstCall.refetchOnReconnect).toBe(false);
    expect(firstCall.retryOnMount).toBe(true);
    expect(retry(0, { response: { status: 400 } })).toBe(false);
    expect(retry(0, { response: { status: 502 } })).toBe(true);
  });
});
