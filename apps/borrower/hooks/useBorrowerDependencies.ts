import { useEffect, useState } from 'react';

import { useEntity } from '@contexts';
import useDefaultTerms from '@hooks/useDefaultTerms';
import useOrders from '@hooks/useOrders';
import usePaymentMethods from '@hooks/usePaymentMethods';
import useStats from '@hooks/useStats';
import useCompanyUsers from '../../../shared/hooks/useCompanyUsers';

type FetchConfig = {
  stats?: boolean;
  payment_methods?: boolean;
  default_terms?: boolean;
  orders?: boolean;
  company_users?: boolean;
};

function useBorrowerDependencies(user: any, fetchConfig: FetchConfig = {}) {
  let dependencies;
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

  dependencies = {
    isLoading,
    ...stats,
    ...defaultTermsProps,
    ...paymentMethodProps,
    ...orderProps,
    ...companyUserProps,
  };
  return { dependencies };
}

export default useBorrowerDependencies;
