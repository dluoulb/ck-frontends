import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiContext } from 'contexts';

import { getAccount } from '../../../lib/actions/accounts';
import { getCompany } from '../../../lib/actions/companies';
import {
  getPaymentSchedule,
  getTransactions,
} from '../../../lib/actions/orders';

function useOrderDependencies(order) {
  let orderProps;
  const api = useContext(ApiContext);
  const fetchConfig = {
    enabled: !!order && !orderProps,
    retry: false,
  };

  const {
    data: entity,
    error: entityError,
    isLoading: entityLoading,
  } = useQuery({
    queryKey: ['entity', order?.id],
    queryFn: () =>
      order?.entity_type === 'company'
        ? getCompany(api, order?.entity_id)
        : getAccount(api, order?.entity_id),
    ...fetchConfig,
  });

  const {
    data: transactions,
    error: transactionsError,
    isLoading: transactionsLoading,
  } = useQuery({
    queryKey: ['transactions', order?.id],
    queryFn: () => getTransactions(api, order?.id),
    ...fetchConfig,
  });

  const {
    data: paymentSchedule,
    error: psError,
    isLoading: psLoading,
  } = useQuery({
    queryKey: ['payment_schedule', order?.id],
    queryFn: () => getPaymentSchedule(api, order?.id),
    ...fetchConfig,
  });

  const hasErrors = entityError || transactionsError || psError;
  const isLoading = entityLoading || transactionsLoading || psLoading;
  const errors = {
    entityError,
    transactionsError,
    psError,
  };

  orderProps = {
    type: order?.entity_type,
    entity,
    transactions,
    paymentSchedule,
    errors,
    hasErrors,
    isLoading,
  };

  return { orderProps };
}

export default useOrderDependencies;
