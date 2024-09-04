import React from 'react';

import OrdersTable from '@components/orders_table/OrdersTable';
import useOrders from '@hooks/useOrders';
import { TableColumns } from './order_table/TableColumns';

export default function OrderDashboard({ props }) {
  const { orders, ordersLoading, pageCount, fetchData } = useOrders(
    props,
    0,
    false,
    true
  );
  const totalRows = props?.stats?.active + props?.stats?.closed;

  return (
    <div className="min-h-[72rem]" role={OrderDashboard.role}>
      <OrdersTable
        orders={orders}
        ordersLoading={ordersLoading}
        pageCount={pageCount}
        fetchData={fetchData}
        tableColumns={TableColumns}
        totalRows={totalRows}
        pageSize={25}
      />
    </div>
  );
}

OrderDashboard.role = 'order-dashboard-component';
