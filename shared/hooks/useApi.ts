import { useContext, useEffect } from 'react';
import { ApiContext } from 'pages/_app';
import Session from 'supertokens-auth-react/recipe/session';

import { createResponseErrorHandler } from '@lib/sessionErrorHandler';

function useApi() {
  const api = useContext(ApiContext);

  useEffect(() => {
    let isMounted = true;

    async function setupInterceptor() {
      const sessionExists = await Session.doesSessionExist();
      if (!sessionExists || !isMounted) return;

      const token = await Session.getAccessToken();
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const responseInterceptor = api.interceptors.response.use(
        (response) => response,
        createResponseErrorHandler(api),
      );

      return () => {
        api.interceptors.response.eject(responseInterceptor);
        isMounted = false;
      };
    }

    setupInterceptor();

    return () => {
      isMounted = false;
    };
  }, []);

  return api;
}

export default useApi;
