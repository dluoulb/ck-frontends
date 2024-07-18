import { useContext, useEffect } from 'react';
import { ApiContext } from 'contexts';
import { signOut, useSession } from 'next-auth/react';

const useApi = () => {
  const api = useContext(ApiContext);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      api.defaults.headers.common['Authorization'] =
        `Bearer ${session.access_token}`;

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
    }
  }, [session, status]);

  return api;
};

export default useApi;
