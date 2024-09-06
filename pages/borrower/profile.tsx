import React from 'react';

import PortalLayout from '@apps/borrower/components/PortalLayout';
import ProfileIndex from '@apps/borrower/components/profile';
import { DependenciesProvider } from '@contexts';
import useUser from '@hooks/useUser';

export default function Profile() {
  const { user } = useUser();
  return (
    <PortalLayout>
      <DependenciesProvider user={user} fetchConfig={{ company_users: true }}>
        <ProfileIndex />
      </DependenciesProvider>
    </PortalLayout>
  );
}

Profile.role = 'profile-component';
