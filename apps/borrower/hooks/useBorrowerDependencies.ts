import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import useApi from '@hooks/useApi';
import useOrders from '@hooks/useOrders';
import { getStats } from '@lib/actions/entities';
import useCompanyUsers from './useCompanyUsers';
import useDefaultTerms from './useDefaultTerms';
import useEntity from './useEntity';
import usePaymentMethods from './usePaymentMethods';

type FetchConfig = {
  entity?: boolean;
  stats?: boolean;
  payment_methods?: boolean;
  default_terms?: boolean;
  orders?: boolean;
  company_users?: boolean;
};

function useBorrowerDependencies(user: any, fetchConfig: FetchConfig = {}) {
  let dependencies;
  const api = useApi();
  const [isLoading, setIsLoading] = useState(false);

  const {
    entity,
    entityError,
    entityRefetching,
    entityLoading,
    refetchEntity,
  } = useEntity(user, fetchConfig?.entity);

  const {
    data: stats,
    error: statsError,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ['stats', entity?.id],
    queryFn: () => getStats(api, entity),
    enabled: !!entity && !!fetchConfig?.stats,
    retry: 1,
  });

  const entityProps = {
    entity,
    entityError,
    entityRefetching,
    entityLoading,
    refetchEntity,
  };

  const companyUserProps = useCompanyUsers(
    entity,
    fetchConfig?.company_users
  );

  const { defaultTerms, defaultTermsLoading } = useDefaultTerms(
    entity,
    fetchConfig?.default_terms
  );

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
        statsLoading ||
        defaultTermsLoading ||
        paymentMethodProps?.paymentMethodsLoading ||
        companyUserProps?.companyUsersLoading
    );
  }, [
    user,
    entityLoading,
    statsLoading,
    defaultTermsLoading,
    paymentMethodProps?.paymentMethodsLoading,
    companyUserProps?.companyUsersLoading,
  ]);

  dependencies = {
    isLoading,
    type: user?.company_id ? 'company' : 'account',
    stats,
    statsError,
    defaultTerms,
    ...entityProps,
    ...paymentMethodProps,
    ...orderProps,
    ...companyUserProps,
  };
  return { dependencies };
}

export default useBorrowerDependencies;
