import { useEntity } from '@contexts/EntityContext';
import usePaymentSchedule from '@hooks/usePaymentSchedule';
import useTransactions from '@hooks/useTransactions';

function useOrderDependencies(order) {
  const { entity, entityError, entityLoading } = useEntity(
    order?.entity_id,
    order?.entity_type
  );

  const transactions = useTransactions(order);
  const paymentSchedule = usePaymentSchedule(order);

  const isLoading =
    entityLoading ||
    transactions?.transactionsLoading ||
    paymentSchedule?.paymentScheduleLoading;

  const orderDeps = {
    isLoading,
    order,
    entity,
    entityError,
    ...transactions,
    ...paymentSchedule,
  };

  return { orderDeps };
}

export default useOrderDependencies;
