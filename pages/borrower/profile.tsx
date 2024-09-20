import type { ReactElement } from 'react';

import PortalLayout from '@apps/borrower/components/PortalLayout';
import ProfileIndex from '@apps/borrower/components/profile';
import { BorrowerContextProvider } from '@contexts/BorrowerContext';
import { EntityProvider } from '@contexts/EntityContext';

export default function Profile() {
  return <ProfileIndex />;
}

Profile.getLayout = function getLayout(page: ReactElement) {
  return (
    <EntityProvider>
      <BorrowerContextProvider>
        <PortalLayout>{page}</PortalLayout>
      </BorrowerContextProvider>
    </EntityProvider>
  );
};

Profile.role = 'profile-component';
