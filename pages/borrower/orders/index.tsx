import type { ReactElement } from 'react';

import Orders from '@apps/borrower/components/orders';
import PortalLayout from '@apps/borrower/components/PortalLayout';
import { BorrowerContextProvider } from '@contexts/BorrowerContext';
import { EntityProvider } from '@contexts/EntityContext';

export default function OrdersIndex({}) {
  return <Orders />;
}

OrdersIndex.getLayout = function getLayout(page: ReactElement) {
  return (
    <EntityProvider>
      <BorrowerContextProvider>
        <PortalLayout>{page}</PortalLayout>
      </BorrowerContextProvider>
    </EntityProvider>
  );
};
