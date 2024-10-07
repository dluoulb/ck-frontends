import React, { useState } from 'react';

import Loading from '@components/Loading';
import OrdersTable from '@components/orders_table/OrdersTable';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useEntity } from '@contexts/EntityContext';
import useOrders from '@hooks/useOrders';
import { TableColumns } from './TableColumns';
import BorrowerOverview from '../home/BorrowerOverview';
import Stats from '../home/Stats';

export default function Orders() {
  const { entity, entityLoading } = useEntity();
  const { isLoading } = useBorrowerDeps();
  const [ordersPageIndex, setOrdersPageIndex] = useState(0);
  const { orders, ordersLoading, pageCount, isFetching, totalOrderCount } =
    useOrders(entity, isLoading, ordersPageIndex);

  if (isLoading || ordersLoading || entityLoading)
    return <Loading className="w-14 h-14 my-20" />;

  if (!entity) return;

  return (
    <div
      data-testid="container"
      className="my-4 md:my-6 mx-auto h-full"
      role={Orders.role}
    >
      <div className="mx-2 2xl:max-w-[90%] md:mx-auto h-full">
        <p className="text-2xl md:text-4xl font-bold text-primary capitalize">
          My Orders
        </p>
        <div className="relative rounded-md border-t border-x border-border-gray shadow-sm mt-4 md:mt-8">
          <BorrowerOverview />
          <div className="relative my-4 md:my-6">
            <div className="py-2 md:py-3 border border-gray-200 border-x-0 rounded-none px-2 md:px-3">
              <Stats />
            </div>
            <OrdersTable
              orders={orders}
              entity={entity}
              defaultSort="created_at"
              pageSize={25}
              pageCount={pageCount}
              tableColumns={TableColumns}
              totalOrderCount={totalOrderCount}
              rowClass="!text-sm"
              tableClass="!min-w-max lg:!min-w-full 3xl:!min-w-max"
              withHeader={true}
              isFetching={isFetching}
              setOrdersPageIndex={setOrdersPageIndex}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

Orders.role = 'orders-page';
