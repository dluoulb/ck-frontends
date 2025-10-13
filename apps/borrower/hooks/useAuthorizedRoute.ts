import { useEntity } from '@contexts/EntityContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function useAuthorizedRoute() {
  const { entity } = useEntity();
  const { asPath } = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    switch (asPath) {
      case '/wallet':
        setIsAuthorized(!!entity?.vc_enabled);
        break;
      default:
        setIsAuthorized(true);
    }
  }, [asPath, entity]);

  return {
    isAuthorized,
  };
}

export default useAuthorizedRoute;

