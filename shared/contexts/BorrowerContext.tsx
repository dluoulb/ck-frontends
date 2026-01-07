import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useUser } from '@contexts/UserContext';
import useDefaultTerms from '@hooks/useDefaultTerms';
import useActiveOrders from '@hooks/useActiveOrders';
import usePaymentMethods from '@hooks/usePaymentMethods';
import useStats from '@hooks/useStats';
import { useEntity } from './EntityContext';
import useCompanyUsers from '../hooks/useCompanyUsers';

const BorrowerContext = createContext(null);

export const BorrowerContextProvider = ({ children }) => {
  const router = useRouter();
  const { user } = useUser();
  const { entity, entityLoading } = useEntity();
  const [isLoading, setIsLoading] = useState(false);
  
  const shouldFetchDashboardOrders = router?.pathname === '/borrower';
  const activeOrderProps = useActiveOrders(
    shouldFetchDashboardOrders ? entity : null,
    10
  );

  const stats = useStats(entity);
  const companyUserProps = useCompanyUsers(
    entity,
    router?.pathname.includes('/profile')
  );
  const defaultTermsProps = useDefaultTerms(
    entity,
    ['/borrower', '/borrower/virtual_card', '/borrower/wallet'].includes(router?.pathname)
  );
  const paymentMethodProps = usePaymentMethods(
    user,
    entity,
    ['/borrower', '/borrower/payment_methods', '/borrower/orders', '/borrower/orders/[id]'].includes(router?.pathname)
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
    ...activeOrderProps,
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
