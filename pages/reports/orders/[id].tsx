import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import AdditionalInfo from '@apps/reports/components/order_detail/AdditionalInfo';
import OrderOverview from '@apps/reports/components/order_detail/OrderOverview';
import BorrowerInfo from '@apps/reports/components/order_detail/overview/BorrowerInfo';
import MerchantInfo from '@apps/reports/components/order_detail/overview/MerchantInfo';
import OrderInfo from '@apps/reports/components/order_detail/overview/OrderInfo';
import ProductInfo from '@apps/reports/components/order_detail/overview/ProductInfo';
import PSTable from '@apps/reports/components/order_detail/payment_schedule/PSTable';
import TransactionsTable from '@apps/reports/components/order_detail/transactions_table/TransactionsTable';
import PageNavigation from '@apps/reports/components/PageNavigation';
import useOrderDependencies from '@apps/reports/hooks/useOrderDependencies';
import Loading from '@components/Loading';
import NoDataError from '@components/NoDataError';
import useApi from '@hooks/useApi';
import { getOrder } from '@lib/actions/orders';

const OrderIndex = () => {
  const router = useRouter();
  const api = useApi();
  const { id } = router.query;

  const {
    data: order,
    error: orderError,
    isLoading: orderLoading,
  } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(api, id),
    enabled: !!id,
    retry: 1,
  });

  const {
    orderProps: {
      type,
      entity,
      errors,
      hasErrors,
      paymentSchedule,
      transactions,
      isLoading,
    },
  } = useOrderDependencies(order);

  if (orderError) return <NoDataError tag="Order" withButton={true} />;

  if (errors.entityError) return <NoDataError tag="User" withButton={true} />;

  return (
    <div role={OrderIndex.role}>
      {(orderLoading || isLoading) && !hasErrors ? (
        <Loading className="w-14 h-14 my-16" />
      ) : (
        <>
          <PageNavigation order={order} type={type} entity={entity} />
          <p className="text-4xl font-bold text-primary">Order Details</p>
          <div className="relative rounded-t-md border-t border-x border-border-gray shadow-sm mt-8 pb-16">
            <div className="p-6">
              <OrderOverview order={order} product={order?.product} />
              <div className="my-6">
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 sm:p-2 md:p-4">
                  <OrderInfo order={order} product={order?.product} />
                  <ProductInfo order={order} product={order?.product} />
                  <MerchantInfo order={order} product={order?.product} />
                  <BorrowerInfo order={order} entity={entity} />
                </div>
              </div>
              <AdditionalInfo
                order={order}
                product={order?.product}
                entity={entity}
              />
              <PSTable
                payment_schedule={paymentSchedule}
                err={errors.psError}
              />
              <TransactionsTable
                transactions={transactions}
                err={errors.transactionsError}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderIndex;

OrderIndex.role = 'order-index-component';
