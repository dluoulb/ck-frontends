import { useContext, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { ApiContext } from "contexts";

const useApi = () => {
  const api = useContext(ApiContext);
  const { data: session, status } = useSession();

  // TODO: TEST OUT HITTING API WITH NO BEARER TOKEN!!!
  useEffect(() => {
    if (status === "authenticated") {
      api.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${session.access_token}`;

      const responseInterceptor = api.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response.status === 403) {
            signOut();
            // window.location.href = "/login";
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
