import Session, { attemptRefreshingSession, signOut } from 'supertokens-auth-react/recipe/session';

export const createResponseErrorHandler = (api) => async (error) => {
  const originalRequest = error?.config;
  if (!originalRequest) return Promise.reject(error);

  originalRequest.headers = originalRequest.headers ?? {};
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      const success = await attemptRefreshingSession();
      if (success) {
        const newToken = await Session.getAccessToken();
        if (api?.defaults?.headers?.common) {
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        }
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return api(originalRequest);
      } else {
        await signOut();
      }
    } catch {
      return Promise.reject(error);
    }
  }

  return Promise.reject(error);
};
