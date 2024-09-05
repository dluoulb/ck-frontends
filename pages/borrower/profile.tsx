import React from 'react';

import PortalLayout from '@apps/borrower/components/PortalLayout';
import ProfileIndex from '@apps/borrower/components/profile';
import { EntitiesProvider } from '@contexts';
import useUser from '@hooks/useUser';

export default function Profile() {
  const { user } = useUser();
  return (
    <PortalLayout>
      <EntitiesProvider
        user={user}
        fetchConfig={{ entity: true, company_users: true }}
      >
        <ProfileIndex />
      </EntitiesProvider>
    </PortalLayout>
  );
}

Profile.role = 'profile-component';
