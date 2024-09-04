import React from 'react';

import Loading from '@components/Loading';
import OrdersTable from '@components/orders_table/OrdersTable';
import { useBorrowerDeps } from '@contexts';
import { TableColumns } from './TableColumns';

export default function Orders() {
  const { orders, ordersLoading, pageCount, fetchData } = useBorrowerDeps();

  if (!orders && ordersLoading) return <Loading className="w-14 h-14 my-20" />;

  return (
    <div
      data-testid="container"
      className="my-4 md:my-6 mx-auto h-full"
      role={Orders.role}
    >
      <div className="mx-2 md:max-w-[90%] md:mx-auto h-full">
        <p className="text-2xl md:text-4xl font-bold text-primary capitalize">
          Orders
        </p>
        <div className="my-4">
          <OrdersTable
            orders={orders}
            ordersLoading={ordersLoading}
            pageCount={pageCount}
            fetchData={fetchData}
            tableColumns={TableColumns}
            totalRows={orders?.length}
            pageSize={25}
            rowClass="text-sm"
            withHeader={true}
          />
        </div>
      </div>
    </div>
  );
}

Orders.role = 'orders-page';
