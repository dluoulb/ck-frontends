import { useRouter } from 'next/router';

import { useEntity } from '@contexts/EntityContext';

function useAuthorizedRoute() {
  const { entity, entityLoading } = useEntity();
  const { pathname } = useRouter();
  const normalizedPathname = pathname.split('/borrower').pop();
  const isAuthorized = (() => {
    switch (normalizedPathname) {
      case '/wallet':
        return !!entity?.vc_enabled;
      case '/plus':
        return !!entity?.plus_enabled;
      default:
        return true;
    }
  })();

  return {
    isAuthorized: entityLoading || isAuthorized,
  };
}

export default useAuthorizedRoute;
