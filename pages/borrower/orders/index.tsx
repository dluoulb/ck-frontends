import React from 'react';

import Orders from '@apps/borrower/components/orders';
import PortalLayout from '@apps/borrower/components/PortalLayout';
import { DependenciesProvider } from '@contexts/DependenciesContext';
import useUser from '@hooks/useUser';

export default function OrdersIndex({}) {
  const { user } = useUser();

  return (
    <PortalLayout>
      <DependenciesProvider user={user} fetchConfig={{ orders: true }}>
        <Orders />
      </DependenciesProvider>
    </PortalLayout>
  );
}
