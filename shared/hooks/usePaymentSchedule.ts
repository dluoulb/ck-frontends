import { useQuery } from '@tanstack/react-query';

import useApi from '@hooks/useApi';
import { getPaymentSchedule } from '@lib/actions/orders';

function usePaymentSchedule(order) {
  const api = useApi();

  const {
    data: paymentSchedule,
    error: paymentScheduleError,
    isLoading: paymentScheduleLoading,
  } = useQuery({
    queryKey: ['payment_schedule', order?.id],
    queryFn: () => getPaymentSchedule(api, order?.id),
    enabled: !!order,
    retry: false,
  });

  return {
    paymentSchedule,
    paymentScheduleError,
    paymentScheduleLoading,
  };
}
export default usePaymentSchedule;
