import React from 'react';

import { BorrowerContextProvider } from '@contexts/BorrowerContext';
import { EntityProvider } from '@contexts/EntityContext';
import PortalLayout from './PortalLayout';

export default function BorrowerPageWrapper({ children }) {
  return (
    <EntityProvider>
      <BorrowerContextProvider>
        <PortalLayout>{children}</PortalLayout>
      </BorrowerContextProvider>
    </EntityProvider>
  );
}
