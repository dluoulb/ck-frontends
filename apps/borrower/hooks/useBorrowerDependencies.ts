import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import useApi from '@hooks/useApi';
import useOrders from '@hooks/useOrders';
import { getCompany } from '@lib/actions/companies';
import { getAccount, getStats } from '@lib/actions/entities';
import { getPaymentMethods } from '@lib/actions/payment_methods';
import useDefaultTerms from './useDefaultTerms';

type FetchConfig = {
  entity?: boolean;
  stats?: boolean;
  payment_methods?: boolean;
  default_terms?: boolean;
  orders?: boolean;
};

function useBorrowerDependencies(user: any, fetchConfig: FetchConfig = {}) {
  let userProps;
  const api = useApi();
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let encodedEmail = encodeURIComponent(user?.email);

  const {
    data: entity,
    error: entityError,
    isRefetching: entityRefetching,
    isLoading: entityLoading,
    refetch: refetchEntity,
  } = useQuery({
    queryKey: [
      user?.company_id ? 'company' : 'account',
      user?.company_id ? user?.company_id : user?.account_id,
    ],
    queryFn: () =>
      user?.company_id
        ? getCompany(api, user?.company_id, 'include=cta_banners')
        : getAccount(api, user?.account_id),
    enabled: !!user && !userProps && !!fetchConfig?.entity,
    retry: false,
  });

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

  const {
    data: paymentMethods,
    error: paymentMethodsError,
    isRefetching: paymentMethodsRefetching,
    isLoading: paymentMethodsLoading,
    refetch: refetchPaymentMethods,
  } = useQuery({
    queryKey: ['payment_methods', entity?.id],
    queryFn: () => getPaymentMethods(api, `filter[email]=${encodedEmail}`),
    enabled: !!entity && !!fetchConfig?.payment_methods,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const { defaultTerms, defaultTermsLoading } = useDefaultTerms(
    entity,
    !!fetchConfig?.default_terms
  );

  const { orders, ordersLoading, ordersError } = useOrders(
    {
      type: entity?.type,
      entity,
    },
    0,
    isLoading,
    !!fetchConfig?.orders
  );

  useEffect(() => {
    if (entityError || statsError || paymentMethodsError || ordersError)
      setHasErrors(true);
  }, [entityError, statsError, paymentMethodsError, ordersError]);

  useEffect(() => {
    setIsLoading(
      !user ||
        (fetchConfig?.entity && entityLoading) ||
        (fetchConfig?.stats && statsLoading) ||
        (fetchConfig?.payment_methods && paymentMethodsLoading) ||
        defaultTermsLoading
    );
  }, [
    user,
    fetchConfig?.entity,
    entityLoading,
    fetchConfig?.stats,
    statsLoading,
    fetchConfig?.payment_methods,
    paymentMethodsLoading,
    defaultTermsLoading,
  ]);

  const errors = { entityError, statsError, paymentMethodsError, ordersError };

  userProps = {
    type: user?.company_id ? 'company' : 'account',
    stats: fetchConfig?.stats ? stats : undefined,
    entity: fetchConfig?.entity ? entity : undefined,
    entityRefetching,
    refetchEntity,
    errors,
    hasErrors,
    isLoading,
    paymentMethods: fetchConfig?.payment_methods ? paymentMethods : undefined,
    paymentMethodsLoading,
    refetchPaymentMethods,
    paymentMethodsRefetching,
    defaultTerms: fetchConfig?.default_terms ? defaultTerms : undefined,
    orders: fetchConfig?.orders ? orders : undefined,
    ordersLoading,
  };

  return { userProps };
}

export default useBorrowerDependencies;
