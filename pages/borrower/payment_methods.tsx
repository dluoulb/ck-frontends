import React from 'react';

import PaymentMethods from '@apps/borrower/components/payment_methods';
import PortalLayout from '@apps/borrower/components/PortalLayout';
import { DependenciesProvider } from '@contexts/DependenciesContext';
import useUser from '@hooks/useUser';

export default function PaymentMethodsIndex() {
  const { user } = useUser();
  return (
    <PortalLayout>
      <DependenciesProvider user={user} fetchConfig={{ payment_methods: true }}>
        <PaymentMethods />
      </DependenciesProvider>
    </PortalLayout>
  );
}

PaymentMethodsIndex.role = 'payment-methods-index';
