import { useEffect, useRef } from 'react';

import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import { identifyUser } from '@lib/customerio';

export const useCustomerIO = () => {
  const { user, isImpersonating } = useUser();
  const { entity, entityLoading } = useEntity();
  const hasIdentified = useRef(false);

  useEffect(() => {
    if (
      user &&
      entity &&
      !entityLoading &&
      !isImpersonating &&
      !hasIdentified.current
    ) {
      identifyUser(user, entity);
      hasIdentified.current = true;
    }
  }, [user, entity, entityLoading, isImpersonating]);
};
