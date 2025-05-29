import { useContext, useEffect } from 'react';
import { ApiContext } from 'pages/_app';
import Session, {
  attemptRefreshingSession,
  signOut,
} from 'supertokens-auth-react/recipe/session';

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
        async (error) => {
          const originalRequest = error.config;

          if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
              const success = await attemptRefreshingSession();
              if (success) {
                const newToken = await Session.getAccessToken();
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                return api(originalRequest);
              } else {
                signOut();
              }
            } catch (refreshError) {
              return Promise.reject(error);
            }
          }

          if (error.response?.status === 403) {
            signOut();
          }

          return Promise.reject(error);
        }
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
