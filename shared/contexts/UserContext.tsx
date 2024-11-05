import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { useMutation } from '@tanstack/react-query';

import useApi from '@hooks/useApi';
import { getUser } from '@lib/actions/users';

type TokenData = {
  userID: string;
  isImpersonating: boolean;
  parentID: string;
};

interface UserState {
  user: any;
  userLoading: boolean;
  isAdminUser: boolean;
  isImpersonating: boolean;
  parentID: string;
  getCurrentUser: (tokenData: { userID: string }) => Promise<any>;
  setUser: Dispatch<
    SetStateAction<{
      user: any;
      isImpersonating: boolean;
      parentID: string;
      isAdminUser: boolean;
    }>
  >;
}

const defaultState: UserState = {
  user: null,
  userLoading: false,
  setUser: () => {},
  isAdminUser: false,
  isImpersonating: false,
  parentID: '',
  getCurrentUser: async () => null,
};

export const UserContext = createContext<UserState>(defaultState);

export const UserProvider = ({
  children,
  initialUserState = {
    user: null,
    isAdminUser: false,
    isImpersonating: false,
    parentID: '',
  },
}) => {
  const api = useApi();
  const [userState, setUser] = useState(initialUserState);

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ['user', userState?.user?.id],
    mutationFn: (tokenData: { userID: string }) =>
      getUser(api, tokenData.userID),
    onSuccess: (data, variables: TokenData) => {
      const { isImpersonating, parentID } = variables;
      setUser({
        user: data,
        isImpersonating,
        isAdminUser: ['admin', 'staff', 'superadmin'].includes(data.role),
        parentID,
      });
    },
    onError: (error) =>
      console.log('Error occurred fetching current user', { error }),
    retry: 1,
  });

  return (
    <UserContext.Provider
      value={{
        ...userState,
        setUser,
        userLoading: isPending,
        getCurrentUser: mutateAsync,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
};
