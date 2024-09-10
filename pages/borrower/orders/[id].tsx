import React from 'react';

import OrderDetail from '@apps/borrower/components/order_detail';
import PortalLayout from '@apps/borrower/components/PortalLayout';
import { DependenciesProvider } from '@contexts';
import useUser from '@hooks/useUser';

export default function OrderIDIndex() {
  const { user } = useUser();

  return (
    <PortalLayout>
      <DependenciesProvider user={user} fetchConfig={{ payment_methods: true }}>
        <OrderDetail />
      </DependenciesProvider>
    </PortalLayout>
  );
}
