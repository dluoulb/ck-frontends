import { createContext, Dispatch, SetStateAction } from "react";

interface AuthState {
  auth: any;
  setAuth: Dispatch<SetStateAction<any>>;
  loading: any;
  setLoading: Dispatch<SetStateAction<any>>;
  redirectToLogin: (location: string) => void;
  signin: (data: any) => void;
  signout: () => void;
  verify: any;
  verifyToken: any;
  refreshToken: any;
  accessToken: any;
  isAuthorized: any;
  isAuthenticated: any;
}

const defaultState: AuthState = {
  auth: null,
  setAuth: () => {},
  loading: null,
  setLoading: () => {},
  redirectToLogin: () => {},
  signin: () => {},
  signout: () => {},
  verify: null,
  verifyToken: null,
  refreshToken: null,
  accessToken: null,
  isAuthorized: false,
  isAuthenticated: false,
};

export const AuthContext = createContext<AuthState>(defaultState);
