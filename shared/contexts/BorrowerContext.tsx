import React, { createContext, useContext, useEffect, useState } from 'react';

import useDefaultTerms from '@hooks/useDefaultTerms';
import useOrders from '@hooks/useOrders';
import usePaymentMethods from '@hooks/usePaymentMethods';
import useStats from '@hooks/useStats';
import useUser from '@hooks/useUser';
import { useEntity } from './EntityContext';
import useCompanyUsers from '../hooks/useCompanyUsers';

const BorrowerContext = createContext(null);

export const BorrowerContextProvider = ({ children }) => {
  const { user } = useUser();
  const { entity, entityLoading } = useEntity();
  const [isLoading, setIsLoading] = useState(false);

  const stats = useStats(entity);
  const companyUserProps = useCompanyUsers(entity);
  const defaultTermsProps = useDefaultTerms(entity);
  const paymentMethodProps = usePaymentMethods(user, entity);
  const orderProps = useOrders(
    {
      type: entity?.type,
      entity,
    },
    isLoading
  );

  useEffect(() => {
    setIsLoading(
      !user ||
        entityLoading ||
        stats?.statsLoading ||
        defaultTermsProps?.defaultTermsLoading ||
        paymentMethodProps?.paymentMethodsLoading ||
        companyUserProps?.companyUsersLoading
    );
  }, [
    user,
    entityLoading,
    stats?.statsLoading,
    defaultTermsProps?.defaultTermsLoading,
    paymentMethodProps?.paymentMethodsLoading,
    companyUserProps?.companyUsersLoading,
  ]);

  const dependencies = {
    isLoading,
    ...stats,
    ...defaultTermsProps,
    ...paymentMethodProps,
    ...orderProps,
    ...companyUserProps,
  };

  return (
    <BorrowerContext.Provider value={dependencies}>
      {children}
    </BorrowerContext.Provider>
  );
};

export const useBorrowerDeps = () => {
  const context = useContext(BorrowerContext);
  if (!context) {
    throw new Error(
      'useBorrowerDeps must be used within a BorrowerContextProvider'
    );
  }
  return context;
};
