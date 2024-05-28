import { createContext, Dispatch, SetStateAction } from 'react';

interface UserState {
  user: any;
  setUser: Dispatch<SetStateAction<any>>;
}

const defaultState: UserState = {
  user: null,
  setUser: () => {},
};

export const UserContext = createContext<UserState>(defaultState);