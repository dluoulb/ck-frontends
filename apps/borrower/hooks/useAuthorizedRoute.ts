import { useRouter } from 'next/router';

import { useEntity } from '@contexts/EntityContext';
import { useActiveSubscription } from '@hooks/useSubscription';
import { plusEnabled } from '@lib/constants/SiteVariables';

function useAuthorizedRoute() {
  const { entity, entityLoading } = useEntity();
  const { pathname } = useRouter();
  const isPlusRoute = pathname === '/plus';
  const basePlusEligible = plusEnabled && !entity?.isNetX && !entity?.isAmazonExclusive;
  const { activeSubscription, activeSubscriptionLoading } = useActiveSubscription(
    isPlusRoute ? entity?.id : undefined,
  );
  const isAuthorized = (() => {
    switch (pathname) {
      case '/wallet':
        return !!entity?.vc_enabled;
      case '/plus':
        return (
          basePlusEligible && (entity?.underwriting_status === 'approved' || !!activeSubscription)
        );
      default:
        return true;
    }
  })();

  return {
    isAuthorized:
      entityLoading ||
      (isPlusRoute && basePlusEligible && activeSubscriptionLoading) ||
      isAuthorized,
  };
}

export default useAuthorizedRoute;
