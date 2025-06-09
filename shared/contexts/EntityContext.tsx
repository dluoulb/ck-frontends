import React, { createContext, useContext, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { useUser } from '@contexts/UserContext';
import useApi from '@hooks/useApi';
import { getAccount } from '@lib/actions/accounts';
import { getCompany } from '@lib/actions/companies';
import AccountRecord from '@lib/records/account';
import CompanyRecord from '@lib/records/company';
import {supportPhone} from "@lib/constants/SiteVariables";
import useToast from "@hooks/useToast";

type CompanyOrAccountRecord = CompanyRecord | AccountRecord;

const EntityContext = createContext(null);

export const EntityProvider = ({ children }) => {
  const api = useApi();
  const { user: loggedInUser } = useUser();
  const [entity, setEntity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { makeToast } = useToast();
  const loggedInUserType = loggedInUser?.converted_entity_type || (loggedInUser?.company_id ? 'company' : 'account');
  const loggedInUserId = loggedInUser?.converted_entity_id || loggedInUser?.company_id || loggedInUser?.account_id;

  const entityFn = (id, type) => {
    if (type === 'company') {
      return getCompany(api, id, 'include=cta_banners');
    } else {
      return getAccount(api, id);
    }
  };

  const getEntity = useMutation<
    CompanyOrAccountRecord,
    unknown,
    { id: string | null; type: string | null }
  >({
    mutationFn: ({ id, type }) => {
      if (id && type) {
        return entityFn(id, type);
      } else {
        return entityFn(loggedInUserId, loggedInUserType);
      }
    },
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

  useEffect(() => {
    if (entity && entity?.borrower?.is_verified !== true) {
      setLoading(false);
      setError(true);
      makeToast("Please Call Support to Validate Your Phone Number: " + supportPhone, 'error');
    }
  }, [entity])

  const fetchEntity = (id, type) => {
    setLoading(true);
    getEntity.mutateAsync({ id, type });
  };

  useEffect(() => {
    if (loggedInUser && loggedInUserId) {
      fetchEntity(loggedInUserId, loggedInUserType);
    }
  }, [loggedInUser]);

  return (
    <EntityContext.Provider
      value={{
        entity,
        setEntity,
        fetchEntity,
        entityError: error,
        entityLoading: loading,
      }}
    >
      {children}
    </EntityContext.Provider>
  );
};

export const useEntity = (id = null, type = null) => {
  const context = useContext(EntityContext);
  if (!context) {
    throw new Error('useEntity must be used within an EntityProvider');
  }
  const { fetchEntity, ...rest } = context;

  useEffect(() => {
    if (id && type) {
      fetchEntity(id, type);
    }
  }, [id, type]);

  return { ...rest, fetchEntity };
};
