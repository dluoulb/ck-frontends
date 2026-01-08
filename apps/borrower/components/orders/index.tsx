import React, { useState } from 'react';

import Loading from '@components/Loading';
import OrdersTable from '@components/orders_table/OrdersTable';
import { useEntity } from '@contexts/EntityContext';
import useOrders from '@hooks/useOrders';
import { TableColumns } from './TableColumns';

export default function Orders() {
  const { entity, entityLoading } = useEntity();
  const [ordersPageIndex, setOrdersPageIndex] = useState(0);
  const { orders, ordersLoading, pageCount, totalOrderCount, isFetching } =
    useOrders(entity, false, ordersPageIndex);

  if (ordersLoading || entityLoading)
    return <Loading className="w-14 h-14 my-20" />;

  if (!entity) return;

  return (
    <div
      data-testid="container"
      className="my-4 md:my-6 mx-auto h-full"
      role={Orders.role}
    >
      <div className="mx-2 xl:max-w-[90%] xl:mx-auto h-full">
        <p className="mb-4 text-2xl md:text-3xl font-bold text-primary capitalize">
          My Orders
        </p>
        <OrdersTable
          orders={orders}
          entity={entity}
          defaultSort="created_at"
          pageSize={25}
          pageCount={pageCount}
          rowCount={totalOrderCount}
          tableColumns={TableColumns}
          rowClass="!text-sm bg-white"
          withHeader={true}
          isFetching={isFetching}
          setOrdersPageIndex={setOrdersPageIndex}
        />
      </div>
    </div>
  );
}

Orders.role = 'orders-page';
