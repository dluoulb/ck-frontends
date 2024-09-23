import { useQuery } from '@tanstack/react-query';

import useApi from '@hooks/useApi';
import { getTransactions } from '@lib/actions/orders';

function useTransactions(order) {
  const api = useApi();

  const {
    data: transactions,
    error: transactionsError,
    isLoading: transactionsLoading,
  } = useQuery({
    queryKey: ['transactions', order?.id],
    queryFn: () => getTransactions(api, order?.id),
    enabled: !!order,
    retry: 1,
  });

  return {
    transactions,
    transactionsError,
    transactionsLoading,
  };
}
export default useTransactions;
