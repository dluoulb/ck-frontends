import { useEffect } from 'react';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';

import { getOrders } from '@lib/actions/orders';
import OrderRecord from '@lib/records/order';
import useApi from './useApi';

function useOrders(entity, depsLoading = false, pageIndex = 0) {
  const api = useApi();
  const queryClient = useQueryClient();

  const {
    data,
    error: ordersError,
    isLoading: ordersLoading,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useQuery({
    queryKey: ['orders', entity, entity?.type, pageIndex],
    queryFn: () => getOrders(api, entity, pageIndex),
    enabled: !!entity && !depsLoading,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!isPlaceholderData && data?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: ['orders', entity, entity?.type, pageIndex + 1],
        queryFn: () => getOrders(api, entity, pageIndex + 1),
      });
    }
  }, [data, isPlaceholderData, pageIndex, queryClient]);

  const orders = data?.data?.map((o) => new OrderRecord(o.attributes)) || [];
  const pageCount = data?.metadata?.total_pages || 0;
  const totalOrderCount = data?.metadata?.total_items || 0;

  return {
    orders,
    ordersLoading,
    isFetching,
    ordersError,
    pageCount,
    totalOrderCount,
    refetchOrders: refetch,
  };
}

export default useOrders;
