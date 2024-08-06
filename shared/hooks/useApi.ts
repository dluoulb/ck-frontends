import { useContext, useEffect } from 'react';
import Session, { signOut } from 'supertokens-auth-react/recipe/session';

import { ApiContext } from '@contexts';

function useApi() {
  const api = useContext(ApiContext);

  useEffect(() => {
    if (Session.doesSessionExist()) {
      Session.getAccessToken().then((token) => {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const responseInterceptor = api.interceptors.response.use(
          (response) => response,
          (error) => {
            if (error.response.status === 403) {
              signOut();
            }
            return Promise.reject(error);
          }
        );

        return () => {
          api.interceptors.response.eject(responseInterceptor);
        };
      });
    }
  }, [Session]);

  return api;
}

export default useApi;
