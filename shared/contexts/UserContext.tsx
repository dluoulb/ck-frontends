import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

interface UserState {
  user: any;
  isImpersonating: boolean;
  parentID: string;
  setUser: Dispatch<
    SetStateAction<{
      user: any;
      isImpersonating: boolean;
      parentID: string;
    }>
  >;
}

const defaultState: UserState = {
  user: null,
  setUser: () => {},
  isImpersonating: false,
  parentID: '',
};

export const UserContext = createContext<UserState>(defaultState);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({
  children,
  initialUserState = {
    user: null,
    isImpersonating: false,
    parentID: '',
  },
}) => {
  const [userState, setUser] = useState(initialUserState);

  return (
    <UserContext.Provider value={{ ...userState, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
