import React from 'react';

import PaymentMethods from '@apps/borrower/components/payment_methods';
import PortalLayout from '@apps/borrower/components/PortalLayout';
import { EntitiesProvider } from '@contexts';
import useUser from '@hooks/useUser';

export default function PaymentMethodsIndex() {
  const { user } = useUser();
  return (
    <PortalLayout>
      <EntitiesProvider
        user={user}
        fetchConfig={{
          entity: true,
          payment_methods: true,
        }}
      >
        <PaymentMethods />
      </EntitiesProvider>
    </PortalLayout>
  );
}

PaymentMethodsIndex.role = 'payment-methods-index';
