import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useEntity } from '@contexts/EntityContext';

function useAuthorizedRoute() {
  const { entity, entityLoading } = useEntity();
  const { asPath } = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(true);

  useEffect(() => {
    switch (asPath) {
      case '/wallet':
        setIsAuthorized(!!entity?.vc_enabled);
        break;
      case '/plus':
        setIsAuthorized(!!entity?.plus_enabled);
        break;
      default:
        setIsAuthorized(true);
    }
  }, [asPath, entity, entityLoading]);

  return {
    isAuthorized: entityLoading || isAuthorized,
  };
}

export default useAuthorizedRoute;
