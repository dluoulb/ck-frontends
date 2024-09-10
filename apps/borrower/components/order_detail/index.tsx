import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import Loading from '@components/Loading';
import NoDataError from '@components/NoDataError';
import { useBorrowerDeps, useEntity } from '@contexts';
import useApi from '@hooks/useApi';
import useModal from '@hooks/useModal';
import { getDocuments, getOrder } from '@lib/actions/orders';
import AdditionalFeesDisclosure from './fee_display/AdditionalFeesDisclosure';
import { PaymentsModalWrapper } from './modals/payments';
import OrderOverview from './OrderOverview';
import PaymentScheduleDisclosure from './payment_schedule/PaymentScheduleDisclosure';
import PaymentProgress from './PaymentProgress';
import Stats from './Stats';

export default function OrderDetail() {
  const api = useApi();
  const router = useRouter();
  const { id } = router.query;
  const { entity } = useEntity();

  const {
    data: order,
    error: orderError,
    isLoading: orderLoading,
    refetch: refetchOrder,
    isRefetching: orderRefetching,
  } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrder(api, id),
    enabled: !!id,
    retry: 1,
  });

  const { paymentMethods, paymentMethodsLoading } = useBorrowerDeps();
  const { isModalActive, toggleModal } = useModal();

  const { data: documents, isLoading: documentsLoading } = useQuery({
    queryKey: ['documents', order?.id],
    queryFn: () => getDocuments(api, order),
    enabled: !!order,
    retry: 1,
  });

  if (
    orderLoading ||
    orderRefetching ||
    paymentMethodsLoading ||
    documentsLoading
  )
    return <Loading className="w-14 h-14 my-20" />;

  if (orderError) return <NoDataError tag="order" withButton={false} />;
  
  if (!entity) return;

  return (
    <div
      data-testid="container"
      className="my-4 md:my-6 mx-auto h-full"
      role={OrderDetail.role}
    >
      <div className="mx-2 md:max-w-[90%] md:mx-auto h-full">
        <p className="text-2xl md:text-4xl font-bold text-primary capitalize">
          Order Details
        </p>
        <div className="relative rounded-md border-t border-x border-border-gray shadow-sm mt-8 pb-16 min-h-full">
          <div className="pt-8">
            <OrderOverview
              order={order}
              product={order?.product}
              documents={documents}
            />
            <Stats order={order} />
            <PaymentProgress
              order={order}
              paymentMethods={paymentMethods}
              toggleModal={toggleModal}
            />
            {parseFloat(order?.expected_fees) > 0 && (
              <AdditionalFeesDisclosure order={order} />
            )}
            <PaymentScheduleDisclosure order={order} />
          </div>
        </div>
      </div>
      <PaymentsModalWrapper
        order={order}
        paymentMethods={paymentMethods}
        isModalActive={isModalActive}
        toggleModal={toggleModal}
        refetchOrder={refetchOrder}
      />
    </div>
  );
}

OrderDetail.role = 'order-detail-page';
