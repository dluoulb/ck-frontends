import React from 'react';

import Orders from '@apps/borrower/components/orders';
import PortalLayout from '@apps/borrower/components/PortalLayout';
import { EntitiesProvider } from '@contexts';
import useUser from '@hooks/useUser';

export default function OrdersIndex({}) {
  const { user } = useUser();

  return (
    <PortalLayout>
      <EntitiesProvider
        user={user}
        fetchConfig={{ entity: true, orders: true }}
      >
        <Orders />
      </EntitiesProvider>
    </PortalLayout>
  );
}
