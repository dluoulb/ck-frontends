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
            // const originalRequest = error.config;

            // // Check if the original request is retrying already before trying to refresh supertokens token
            // if (error.response?.status === 401 && !originalRequest._retry) {
            //   originalRequest._retry = true;

            //   try {
            //     await Session.attemptRefreshingSession();

            //     // const newToken = await Session.getAccessToken();
            //     // api.defaults.headers.common['Authorization'] =
            //     //   `Bearer ${newToken}`;
            //     // originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

            //     // return api(originalRequest);
            //   } catch (refreshError) {
            //     signOut();
            //     return Promise.reject(refreshError);
            //   }
            // }

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
