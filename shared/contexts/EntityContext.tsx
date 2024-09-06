import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import useApi from '@hooks/useApi';
import useUser from '@hooks/useUser';
import { getAccount } from '@lib/actions/accounts';
import { getCompany } from '@lib/actions/companies';
import AccountRecord from '@lib/records/account';
import CompanyRecord from '@lib/records/company';

type CompanyOrAccountRecord = CompanyRecord | AccountRecord;

const EntityContext = createContext(null);

export const EntityProvider = ({ children }) => {
  const api = useApi();
  const { user } = useUser();
  const [entity, setEntity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getEntity = useMutation<CompanyOrAccountRecord>({
    mutationKey: [
      user?.company_id ? 'company' : 'account',
      user?.company_id ? user?.company_id : user?.account_id,
    ],
    mutationFn: () =>
      user?.company_id
        ? getCompany(api, user?.company_id, 'include=cta_banners')
        : getAccount(api, user?.account_id),
    onSuccess: (data) => {
      setEntity(data);
      setLoading(false);
      setError(null);
    },
    onError: (error) => {
      setError(error);
      setLoading(false);
      console.log('Error occurred fetching current entity', { error });
    },
    retry: 1,
  });

  const fetchEntity = () => {
    if (user) {
      setLoading(true);
      getEntity.mutate();
    }
  };

  useEffect(() => {
    fetchEntity();
  }, [user]);

  return (
    <EntityContext.Provider
      value={{
        entity,
        setEntity,
        entityError: error,
        entityLoading: loading,
        refetchEntity: fetchEntity,
      }}
    >
      {children}
    </EntityContext.Provider>
  );
};

export const useEntity = () => {
  const context = useContext(EntityContext);
  if (!context) {
    throw new Error('useEntity must be used within an EntityProvider');
  }
  return context;
};
