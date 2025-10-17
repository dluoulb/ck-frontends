import { useEffect, useRef } from 'react';

import { useUser } from '@contexts/UserContext';
import { identifyUser } from '@lib/customerio';

export const useCustomerIO = () => {
  const { user, isImpersonating, isAdminUser } = useUser();
  const hasIdentified = useRef(false);

  useEffect(() => {
    if (isAdminUser || isImpersonating) return;

    if (user && !hasIdentified.current) {
      identifyUser(user);
      hasIdentified.current = true;
    }
  }, [user, isImpersonating, isAdminUser]);
};
