import { useQuery } from '@tanstack/react-query';

import { getActiveOrders } from '@lib/actions/orders';
import useApi from './useApi';

function useActiveOrders(entity, limit = 10) {
  const api = useApi();

  const {
    data,
    error: activeOrdersError,
    isLoading: activeOrdersLoading,
    refetch,
  } = useQuery({
    queryKey: ['activeOrders', entity?.id, entity?.type, limit],
    queryFn: () => getActiveOrders(api, entity, limit),
    enabled: !!entity,
    staleTime: 5 * 60 * 1000,
  });

  const activeOrders = data || [];

  return {
    activeOrders,
    activeOrdersLoading,
    activeOrdersError,
    refetchActiveOrders: refetch,
  };
}

export default useActiveOrders;
