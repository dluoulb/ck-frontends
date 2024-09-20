import { useEffect } from 'react';
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { getOrders } from '@lib/actions/orders';
import OrderRecord from '@lib/records/order';
import useApi from './useApi';

function useOrders(props, depsLoading = false, pageIndex = 0) {
  const api = useApi();
  const { type, entity } = props;
  const queryClient = useQueryClient();

  const {
    data,
    error: ordersError,
    isLoading: ordersLoading,
    isFetching,
    isPlaceholderData,
  } = useQuery({
    queryKey: ['orders', entity, type, pageIndex],
    queryFn: () => getOrders(api, entity, type, pageIndex),
    enabled: !!entity && !depsLoading,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!isPlaceholderData && data?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: ['projects', pageIndex + 1],
        queryFn: () => getOrders(api, entity, type, pageIndex + 1),
      });
    }
  }, [data, isPlaceholderData, pageIndex, queryClient]);

  const orders =
    data?.data?.data?.map((o) => new OrderRecord(o.attributes)) || [];
  const pageCount = data?.data?.metadata?.total_pages || 0;

  return {
    orders,
    ordersLoading,
    isFetching,
    ordersError,
    pageCount,
  };
}

export default useOrders;
