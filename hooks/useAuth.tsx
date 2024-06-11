import { useContext, useEffect, useState, useCallback } from "react";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import Session from "supertokens-auth-react/recipe/session";

import SuperTokensConfig from "../lib/constants/SuperTokensConfig";
import UserRecord from "../records/user";
import { AuthContext, ApiContext, UserContext } from "../contexts";
import { USE_SUPERTOKENS } from "../lib/constants/SiteVariables";
import { getCKItem, removeCKItem, setCKItem } from "../lib/utils/local_storage";

export const useAuth = () => useContext(AuthContext);

export function ProvideAuth({ children }) {
  if (USE_SUPERTOKENS)
    return <WithSuperTokensAuth>{children}</WithSuperTokensAuth>;

  return <WithPersistentAuth>{children}</WithPersistentAuth>;
}

function WithSuperTokensAuth({ children }) {
  const auth = useSuperTokensAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

function WithPersistentAuth({ children }) {
  const auth = usePersistentDataAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

interface CreateTokenParams {
  contact: {
    contact: string;
  };
  type: string;
  ui: string;
}

function usePersistentDataAuth() {
  const api = useContext(ApiContext);
  const { auth, setAuth } = useContext(AuthContext);
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const saved = getCKItem();

  const needsRefresh = (token) => {
    if (!token) return true;

    const expires = DateTime.fromSeconds(token.created_at)
      .plus({ hours: 2 })
      .setZone(DateTime.local().zoneName);

    return DateTime.now().setZone(DateTime.local().zoneName) >= expires;
  };

  const signin = (data) => {
    if (!auth && data && data.authorized && !user) {
      setAuth(data);
      setUser(new UserRecord({ ...data.user }));
      setCKItem(JSON.stringify(data));
    }
  };

  const signout = () => {
    const currentLocation = router.pathname.replace("/", "");

    setAuth(null);
    setUser(null);
    removeCKItem();
    // redirectToLogin(currentLocation);
  };

  // const redirectToLogin = (location) => {
  //   if (typeof window !== "undefined") {
  //     // EVENTUALLY CHANGE TO::::: NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN
  //     const loginUrl = new URL(`${process.env.NEXTAUTH_URL}/login`);
  //     loginUrl.searchParams.set("from", location);

  //     window.location.href = loginUrl.toString();
  //   }
  // };

  const verify = useMutation({
    mutationFn: async ({ contact, type, ui }: CreateTokenParams) => {
      const url = ui ? `/api/users/${ui}/verify` : `/api/users/verify`;

      return await api.post(url, {
        type: type,
        contact: contact.contact,
      });
    },
  });

  const verifyToken = useMutation({
    mutationFn: async ({ payload, ui }: { payload: any; ui: string }) => {
      const url = `/api/users/${ui}/verified`;
      return api.post(url, payload);
    },
  });

  const refreshToken = useMutation({
    mutationFn: (refresh_token) => {
      return api.post("/oauth/token", {
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      });
    },
  });

  return {
    auth,
    setAuth,
    loading,
    setLoading,
    redirectToLogin: null,
    signin,
    signout,
    verify,
    verifyToken,
    refreshToken,
    accessToken: auth?.token?.access_token,
    isAuthorized: !!auth?.authorized,
    isAuthenticated: !!auth,
    saved,
    needsRefresh,
  };
}

export const useSuperTokensAuth = () => {
  const [loading, setLoading] = useState(true);
  const [sessionExists, setSessionExists] = useState(false);

  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);

  const buildContext = useCallback(async () => {
    if (await Session.doesSessionExist()) {
      setSessionExists(true);

      const userId = await Session.getUserId();
      const accessToken = await Session.getAccessToken();
      const accessTokenPayload = await Session.getAccessTokenPayloadSecurely();

      authCtx.setAuth({
        accessToken,
        accessTokenPayload,
        signin,
        signout,
      });

      userCtx.setUser({
        id: userId,
        roles: accessTokenPayload["st-role"]?.v || [],
        permissions: accessTokenPayload["st-perm"]?.v || [],
      });
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    buildContext();
  }, [buildContext]);

  const saved = getCKItem() || undefined;

  const needsRefresh = (token) => {
    const expires = DateTime.fromSeconds(token.created_at)
      .plus({ hours: 2 })
      .setZone(DateTime.local().zoneName);

    return DateTime.now().setZone(DateTime.local().zoneName) >= expires;
  };

  const isAuthenticated = () => sessionExists;

  const isAuthorized = (roles) => {
    if (userCtx.user.roles.includes("superadmin")) return true; // always allow superadmins
    for (const role of userCtx.user.roles) {
      if (roles.includes(role)) {
        return true;
      }
    }
    return false;
  };

  const signin = () => {
    redirectToLogin();
  };

  const signout = async () => {
    try {
      await Session.signOut();
      redirectToLogin();
    } catch (error) {
      redirectToLogin();
    }
  };

  const redirectToLogin = () => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.origin + window.location.pathname;
      const loginUrl = new URL(
        SuperTokensConfig.appInfo.websiteDomain +
          SuperTokensConfig.appInfo.websiteBasePath
      );
      loginUrl.searchParams.set("r", currentUrl);
      window.location.href = loginUrl.toString();
    }
  };

  const accessToken = () => authCtx.auth?.accessToken;

  return {
    auth: authCtx.auth,
    setAuth: authCtx.setAuth,
    loading,
    setLoading,
    redirectToLogin,
    signin,
    signout,
    verify: null,
    verifyToken: null,
    refreshToken: null,
    accessToken,
    isAuthorized,
    isAuthenticated,
    saved,
    needsRefresh,
  };
};
