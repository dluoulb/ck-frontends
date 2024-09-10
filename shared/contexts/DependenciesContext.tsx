import React, { createContext, useContext, useEffect, useState } from 'react';

import useDefaultTerms from '@hooks/useDefaultTerms';
import useOrders from '@hooks/useOrders';
import usePaymentMethods from '@hooks/usePaymentMethods';
import useStats from '@hooks/useStats';
import { useEntity } from './EntityContext';
import useCompanyUsers from '../hooks/useCompanyUsers';

type FetchConfig = {
  stats?: boolean;
  payment_methods?: boolean;
  default_terms?: boolean;
  orders?: boolean;
  company_users?: boolean;
};

const DependenciesContext = createContext(null);

export const DependenciesProvider = ({
  children,
  user,
  fetchConfig = {},
}: {
  children: React.ReactNode;
  user: any;
  fetchConfig: FetchConfig;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { entity, entityLoading } = useEntity();
  const stats = useStats(entity, fetchConfig?.stats);
  const companyUserProps = useCompanyUsers(entity, fetchConfig?.company_users);
  const defaultTermsProps = useDefaultTerms(entity, fetchConfig?.default_terms);
  const paymentMethodProps = usePaymentMethods(
    user,
    entity,
    fetchConfig?.payment_methods
  );
  const orderProps = useOrders(
    {
      type: entity?.type,
      entity,
    },
    isLoading,
    fetchConfig?.orders
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
    <DependenciesContext.Provider value={dependencies}>
      {children}
    </DependenciesContext.Provider>
  );
};

export const useBorrowerDeps = () => {
  const context = useContext(DependenciesContext);
  if (!context) {
    throw new Error(
      'useBorrowerDeps must be used within a DependenciesProvider'
    );
  }
  return context;
};
