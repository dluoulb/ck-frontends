import { useContext } from 'react';
import { faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Link from 'next/link';

import Loading from '@components/Loading';
import NoDataError from '@reports/NoDataError';
import AdditionalInfo from '@reports/orders/AdditionalInfo';
import OrderOverview from '@reports/orders/OrderOverview';
import BorrowerInfo from '@reports/orders/overview/BorrowerInfo';
import MerchantInfo from '@reports/orders/overview/MerchantInfo';
import OrderInfo from '@reports/orders/overview/OrderInfo';
import ProductInfo from '@reports/orders/overview/ProductInfo';
import PSTable from '@reports/orders/payment_schedule/PSTable';
import TransactionsTable from '@reports/orders/transactions_table/TransactionsTable';
import useOrderDependencies from 'hooks/useOrderDependencies';
import { ApiContext } from 'contexts';
import { getOrder } from 'lib/actions/orders';

const OrderIndex = () => {
  const router = useRouter();
  const api = useContext(ApiContext);
  const { id } = router.query;

  const {
    data: order,
    error: orderError,
    isLoading: orderLoading,
  } = useQuery({
    queryKey: ['orders', id],
    queryFn: () => getOrder(api, id),
    enabled: !!id,
    retry: false,
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

  const buildLinkPath = () => {
    if (type === 'account') {
      return `/accounts/${entity?.id}`;
    }
    return `/companies/${entity?.id}`;
  };

  if (orderError) return <NoDataError tag="Order" />;

  if (errors.entityError) return <NoDataError tag="User" />;

  return (
    <div>
      {(orderLoading || isLoading) && !hasErrors ? (
        <Loading className="w-14 h-14 my-16" />
      ) : (
        <>
          <div className="flex items-center my-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-primary font-semibold">
              <div className="flex items-center gap-2">
                <Link href="/" className="hover:text-primary-blue-hover">
                  Search
                </Link>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-xs mt-0.5"
                />
              </div>
              {entity && (
                <>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`${buildLinkPath()}?content=dashboard`}
                      className="hover:text-primary-blue-hover"
                    >
                      {entity?.name}
                    </Link>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="text-xs mt-0.5"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`${buildLinkPath()}?content=loans`}
                      className="hover:text-primary-blue-hover"
                    >
                      Orders
                    </Link>
                    <FontAwesomeIcon
                      icon={faChevronRight}
                      className="text-xs mt-0.5"
                    />
                  </div>
                </>
              )}
              <p className="text-primary-blue-hover">
                {order?.product?.order_key}
              </p>
            </div>
          </div>
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
