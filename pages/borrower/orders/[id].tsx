import type { ReactElement } from 'react';

import OrderDetail from '@apps/borrower/components/order_detail';
import PortalLayout from '@apps/borrower/components/PortalLayout';
import { BorrowerContextProvider } from '@contexts/BorrowerContext';
import { EntityProvider } from '@contexts/EntityContext';

export default function OrderIDIndex() {
  return <OrderDetail />;
}

OrderIDIndex.getLayout = function getLayout(page: ReactElement) {
  return (
    <EntityProvider>
      <BorrowerContextProvider>
        <PortalLayout>{page}</PortalLayout>
      </BorrowerContextProvider>
    </EntityProvider>
  );
};
