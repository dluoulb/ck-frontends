import { useEffect, useRef } from 'react';

import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import useOrders from '@hooks/useOrders';
import { identifyUser } from '@lib/posthog';

export const usePosthogIdentify = () => {
  const { user, isImpersonating, isAdminUser } = useUser();
  const { entity } = useEntity();
  const { totalOrderCount, ordersLoading } = useOrders(entity);
  const hasIdentified = useRef(false);

  useEffect(() => {
    if (isAdminUser || isImpersonating) return;

    if (user?.id && entity?.type === 'company' && !ordersLoading && !hasIdentified.current) {
      identifyUser(user, entity, totalOrderCount);
      hasIdentified.current = true;
    }
  }, [user, entity, totalOrderCount, ordersLoading, isImpersonating, isAdminUser]);
};
