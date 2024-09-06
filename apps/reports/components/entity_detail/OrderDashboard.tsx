import React from 'react';

import Loading from '@components/Loading';
import OrdersTable from '@components/orders_table/OrdersTable';
import useOrders from '@hooks/useOrders';
import { TableColumns } from './order_table/TableColumns';

export default function OrderDashboard({ props }) {
  const { orders, ordersLoading, pageCount } = useOrders(props, false, true);
  const totalRows = props?.stats?.active + props?.stats?.closed;

  if (!orders || ordersLoading) return <Loading className="w-14 h-14 my-20" />;

  return (
    <div className="min-h-[72rem]" role={OrderDashboard.role}>
      <OrdersTable
        orders={orders}
        pageCount={pageCount}
        tableColumns={TableColumns}
        totalRows={totalRows}
        pageSize={25}
      />
    </div>
  );
}

OrderDashboard.role = 'order-dashboard-component';
