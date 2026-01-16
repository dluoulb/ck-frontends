import { useQuery } from '@tanstack/react-query';

import useApi from '@hooks/useApi';
import { getBalance } from '@lib/actions/virtualcards';

function useVirtualCardBalance() {
  const api = useApi();

  const {
    data: balance,
    error: balanceError,
    isLoading: balanceLoading,
    isRefetching: balanceRefetching,
    refetch: refetchBalance,
  } = useQuery({
    queryKey: ['virtual_card'],
    queryFn: () => getBalance(api),
    enabled: true,
    retry: 1,
  });

  return {
    balance,
    balanceError,
    balanceLoading,
    balanceRefetching,
    refetchBalance,
  };
}
export default useVirtualCardBalance;
