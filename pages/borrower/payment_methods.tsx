import type { ReactElement } from 'react';

import PaymentMethods from '@apps/borrower/components/payment_methods';
import PortalLayout from '@apps/borrower/components/PortalLayout';
import { BorrowerContextProvider } from '@contexts/BorrowerContext';
import { EntityProvider } from '@contexts/EntityContext';

export default function PaymentMethodsIndex() {
  return <PaymentMethods />;
}

PaymentMethodsIndex.getLayout = function getLayout(page: ReactElement) {
  return (
    <EntityProvider>
      <BorrowerContextProvider>
        <PortalLayout>{page}</PortalLayout>
      </BorrowerContextProvider>
    </EntityProvider>
  );
};

PaymentMethodsIndex.role = 'payment-methods-index';
