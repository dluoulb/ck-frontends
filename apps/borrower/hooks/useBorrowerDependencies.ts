import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import useApi from '@hooks/useApi';
import {
  getAccount,
  getCompany,
  getPaymentMethods,
  getStats,
} from '@lib/actions/entities';

function useBorrowerDependencies(user) {
  let userProps;
  const api = useApi();
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let encodedEmail = encodeURIComponent(user?.email);
  const fetchConfig = {
    enabled: !!user && !userProps,
    retry: false,
  };

  const {
    data: entity,
    error: entityError,
    isLoading: entityLoading,
  } = useQuery({
    queryKey: [
      user?.company_id ? 'company' : 'account',
      user?.company_id ? user?.company_id : user?.account_id,
    ],
    queryFn: () =>
      user?.company_id
        ? getCompany(api, user?.company_id)
        : getAccount(api, user?.account_id),
    ...fetchConfig,
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

  useEffect(() => {
    if (entityError || statsError || paymentMethodsError) setHasErrors(true);
  }, [entityError]);

  useEffect(() => {
    setIsLoading(
      !user || entityLoading || statsLoading || paymentMethodsLoading
    );
  }, [user, entityLoading, statsLoading, paymentMethodsLoading]);

  const errors = { entityError, statsError, paymentMethodsError };

  userProps = {
    type: user?.company_id ? 'company' : 'account',
    stats,
    entity,
    errors,
    hasErrors,
    isLoading,
    paymentMethods,
  };

  return { userProps };
}

export default useBorrowerDependencies;
