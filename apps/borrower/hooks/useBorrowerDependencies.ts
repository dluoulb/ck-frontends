import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import useApi from '@hooks/useApi';
import useOrders from '@hooks/useOrders';
import { getCompany } from '@lib/actions/companies';
import { getAccount, getPaymentMethods, getStats } from '@lib/actions/entities';
import useDefaultTerms from './useDefaultTerms';

function useBorrowerDependencies(user) {
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
    enabled: !!user && !userProps,
    retry: false,
  });

  const {
    data: stats,
    error: statsError,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ['stats', entity?.id],
    queryFn: () => getStats(api, entity),
    enabled: !!entity,
    retry: 1,
  });

  const {
    data: paymentMethods,
    error: paymentMethodsError,
    isLoading: paymentMethodsLoading,
  } = useQuery({
    queryKey: ['payment_methods', entity?.id],
    queryFn: () => getPaymentMethods(api, `filter[email]=${encodedEmail}`),
    enabled: !!entity,
    retry: 1,
  });

  const { defaultTerms, defaultTermsLoading } = useDefaultTerms(entity);

  const { orders, ordersLoading, ordersError } = useOrders(
    {
      type: entity?.type,
      entity,
    },
    0,
    isLoading
  );

  useEffect(() => {
    if (entityError || statsError || paymentMethodsError || ordersError)
      setHasErrors(true);
  }, [entityError, statsError, paymentMethodsError, ordersError]);

  useEffect(() => {
    setIsLoading(
      !user ||
        entityLoading ||
        statsLoading ||
        paymentMethodsLoading ||
        defaultTermsLoading
    );
  }, [
    user,
    entityLoading,
    statsLoading,
    paymentMethodsLoading,
    defaultTermsLoading,
  ]);

  const errors = { entityError, statsError, paymentMethodsError, ordersError };

  userProps = {
    type: user?.company_id ? 'company' : 'account',
    stats,
    entity,
    entityRefetching,
    refetchEntity,
    errors,
    hasErrors,
    isLoading,
    paymentMethods,
    defaultTerms,
    orders,
    ordersLoading,
  };

  return { userProps };
}

export default useBorrowerDependencies;
