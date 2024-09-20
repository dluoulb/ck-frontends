import type { ReactElement } from 'react';

import BorrowerDashboard from '@apps/borrower/components/home/BorrowerDashboard';
import PortalLayout from '@apps/borrower/components/PortalLayout';
import { BorrowerContextProvider } from '@contexts/BorrowerContext';
import { EntityProvider } from '@contexts/EntityContext';

export default function BorrowerIndex() {
  return <BorrowerDashboard />;
}

BorrowerIndex.getLayout = function getLayout(page: ReactElement) {
  return (
    <EntityProvider>
      <BorrowerContextProvider>
        <PortalLayout>{page}</PortalLayout>
      </BorrowerContextProvider>
    </EntityProvider>
  );
};
