import { useQuery } from '@tanstack/react-query';

import useApi from '@hooks/useApi';
import { getPaymentMethods } from '@lib/actions/payment_methods';

function usePaymentMethods(user, entity, shouldFetch) {
  const api = useApi();
  const entityEmail = entity?.type === 'company' ? entity?.borrower?.email : entity?.user?.email;
  const email = user?.is_admin_user ? entityEmail : user?.email;
  const encodedEmail = encodeURIComponent(email);

  const {
    data: paymentMethods,
    error: paymentMethodsError,
    isRefetching: paymentMethodsRefetching,
    isLoading: paymentMethodsLoading,
    refetch: refetchPaymentMethods,
  } = useQuery({
    queryKey: ['payment_methods', entity?.id],
    queryFn: () => getPaymentMethods(api, `filter[email]=${encodedEmail}`),
    enabled: !!entity && shouldFetch,
    retry: 1,
  });

  const activePaymentMethods = paymentMethods?.filter((pm) => pm.status !== 'removed');

  const defaultCard = activePaymentMethods?.find(
    (pm) => pm.payment_type === 'card' && pm.is_default,
  );
  const defaultBank = activePaymentMethods?.find(
    (pm) => pm.payment_type === 'bank_account' && pm.is_default,
  );

  const hasConnectedCards =
    activePaymentMethods?.filter((pm) => pm.payment_type === 'card').length > 0;
  const hasConnectedBanks =
    activePaymentMethods?.filter((pm) => pm.payment_type === 'bank_account').length > 0;

  const defaultBankLabel = hasConnectedBanks
    ? defaultBank?.label || `${defaultBank?.account_holder} Account`
    : null;

  const defaultCardLabel = hasConnectedCards ? defaultCard?.label : null;

  return {
    activePaymentMethods,
    defaultBank,
    defaultBankLabel,
    defaultCard,
    defaultCardLabel,
    paymentMethods,
    paymentMethodsError,
    paymentMethodsLoading,
    paymentMethodsRefetching,
    refetchPaymentMethods,
  };
}

export default usePaymentMethods;
