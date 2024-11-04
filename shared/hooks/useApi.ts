import { useContext, useEffect } from 'react';
import { ApiContext } from 'pages/_app';
import Session, { signOut } from 'supertokens-auth-react/recipe/session';

function useApi() {
  const api = useContext(ApiContext);

  useEffect(() => {
    if (Session.doesSessionExist()) {
      Session.getAccessToken().then((token) => {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const responseInterceptor = api.interceptors.response.use(
          (response) => response,
          async (error) => {
            if (error.response?.status === 403) {
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
