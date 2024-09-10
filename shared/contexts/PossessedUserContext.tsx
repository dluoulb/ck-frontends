import { createContext, useContext, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import { getUser, getUserByEmail } from '@lib/actions/users';
import UserRecord from '@lib/records/user';
import { useEntity } from './EntityContext';

const PossessedUserContext = createContext(null);

export const PossessedUserProvider = ({ children }) => {
  const api = useApi();
  const { makeToast } = useToast();
  const { entity, setEntity, fetchEntity } = useEntity();

  const [userIdentifier, setUserIdentifier] = useState('');

  const [searchedEmail, setSearchedEmail] = useState(null);
  const [possessedUser, setPossessedUser] = useState(null);
  const [possessedUserLoading, setPossessedUserLoading] = useState(false);

  const [possessedEntity, setPossessedEntity] = useState(null);
  const [possessedEntityLoading, setPossessedEntityLoading] = useState(false);

  const clearPossessedUser = () => {
    setPossessedEntity(null);
    setEntity(null);
    setUserIdentifier('');
  };

  const loginAsUser = (identifier) => {
    setUserIdentifier(identifier);
    setPossessedUserLoading(true);
    setPossessedEntityLoading(true);
    getPossessedUser.mutateAsync(identifier);
  };

  const getPossessedUser = useMutation({
    mutationKey: ['possessed_user', userIdentifier],
    mutationFn: (identifier: string) => {
      if (!identifier) return;
      setPossessedUser(null);
      setPossessedEntity(null);
      const encoded = encodeURIComponent(identifier);

      if (identifier.includes('@')) {
        return getUserByEmail(api, encoded, 'include=cta_banners');
      } else {
        return getUser(api, encoded);
      }
    },
    onSuccess: (data) => {
      const lookupResult = Array.isArray(data)
        ? new UserRecord(data[0].attributes)
        : data;

      setPossessedUser(lookupResult);
      setPossessedUserLoading(false);
      if (!lookupResult) {
        makeToast(
          'User not found, double check your input and try again.',
          'error'
        );
      } else {
        fetchEntity(lookupResult);
      }
    },
    onError: (err) => {
      setPossessedUserLoading(false);
      setPossessedEntityLoading(false);
      console.error('Error occurred fetching current user', err);
      makeToast(
        'User lookup failed, double check your input and try again.',
        'error'
      );
    },

    retry: 1,
  });

  useEffect(() => {
    if (entity && !possessedEntity) {
      setPossessedEntity(entity);
      setPossessedEntityLoading(false);
    }
  }, [entity, possessedEntity]);

  return (
    <PossessedUserContext.Provider
      value={{
        clearPossessedUser,
        loginAsUser,
        possessedEntity,
        possessedEntityLoading,
        searchedEmail,
        setSearchedEmail,
        possessedUser,
        possessedUserLoading,
      }}
    >
      {children}
    </PossessedUserContext.Provider>
  );
};

export const usePossessedUser = () => {
  const context = useContext(PossessedUserContext);
  if (!context) {
    throw new Error(
      'usePossessedUser must be used within an PossessedUserProvider'
    );
  }
  return context;
};
