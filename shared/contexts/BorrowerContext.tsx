import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import PortalLayout from '@apps/borrower/components/layout/PortalLayout';
import { useUser } from '@contexts/UserContext';
import useDefaultTerms from '@hooks/useDefaultTerms';
import useOrders from '@hooks/useOrders';
import usePaymentMethods from '@hooks/usePaymentMethods';
import useStats from '@hooks/useStats';
import { useEntity } from './EntityContext';
import { PromoContextProvider } from './PromoContext';
import useCompanyUsers from '../hooks/useCompanyUsers';

const BorrowerContext = createContext(null);

export const BorrowerContextProvider = ({ children }) => {
  const router = useRouter();
  const { user } = useUser();
  const { entity, entityLoading } = useEntity();
  const [isLoading, setIsLoading] = useState(false);
  const shouldNotFetchOrders =
    isLoading || !['/borrower', '/borrower/orders'].includes(router?.pathname);

  const stats = useStats(entity);
  const companyUserProps = useCompanyUsers(
    entity,
    router?.pathname.includes('/profile')
  );
  const defaultTermsProps = useDefaultTerms(
    entity,
    ['/borrower', '/borrower/virtual_card'].includes(router?.pathname)
  );
  const paymentMethodProps = usePaymentMethods(
    user,
    entity,
    ['/borrower', '/borrower/payment_methods'].includes(router?.pathname)
  );
  const orderProps = useOrders(entity, shouldNotFetchOrders);

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
      <PromoContextProvider>
        <PortalLayout>{children}</PortalLayout>
      </PromoContextProvider>
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
