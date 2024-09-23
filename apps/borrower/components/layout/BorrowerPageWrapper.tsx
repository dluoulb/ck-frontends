import React from 'react';

import { BorrowerContextProvider } from '@contexts/BorrowerContext';
import PortalLayout from './PortalLayout';

export default function BorrowerPageWrapper({ children }) {
  return (
    <BorrowerContextProvider>
      <PortalLayout>{children}</PortalLayout>
    </BorrowerContextProvider>
  );
}
