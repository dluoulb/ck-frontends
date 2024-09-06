import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import OrderDetail from '@apps/borrower/components/order_detail';
import PortalLayout from '@apps/borrower/components/PortalLayout';
import { EntitiesProvider } from '@contexts';
import useApi from '@hooks/useApi';
import useUser from '@hooks/useUser';
import { getOrder } from '@lib/actions/orders';

export default function OrderIDIndex() {
  const { user } = useUser();
  const router = useRouter();
  const api = useApi();
  const { id } = router.query;

  const {
    data: order,
    error: orderError,
    isLoading: orderLoading,
    refetch: refetchOrder,
    isRefetching: orderRefetching,
  } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(api, id),
    enabled: !!id,
    retry: 1,

    // TODO: TAKE THESE OUT!
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <PortalLayout>
      <EntitiesProvider
        user={user}
        fetchConfig={{ entity: true, payment_methods: true }}
      >
        <OrderDetail
          order={order}
          orderError={orderError}
          orderLoading={orderLoading}
          refetchOrder={refetchOrder}
          orderRefetching={orderRefetching}
        />
      </EntitiesProvider>
    </PortalLayout>
  );
}
