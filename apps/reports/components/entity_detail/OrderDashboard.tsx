import React, { useState } from 'react';

import Loading from '@components/Loading';
import OrdersTable from '@components/orders_table/OrdersTable';
import { useReportsDeps } from '@contexts/ReportsContext';
import useOrders from '@hooks/useOrders';
import { TableColumns } from './order_table/TableColumns';

export default function OrderDashboard() {
  const { entity } = useReportsDeps();
  const [ordersPageIndex, setOrdersPageIndex] = useState(0);
  const { orders, ordersLoading, pageCount, totalOrderCount, isFetching } =
    useOrders(entity, false, ordersPageIndex);

  if (!orders || ordersLoading)
    return (
      <Loading className="w-14 h-14 my-20" containerClass="min-h-[72rem]" />
    );

  const getPageSize = () => {
    if (orders?.length === 25) {
      return 25;
    } else if (orders?.length > 10) {
      return 15;
    } else return 10;
  };

  return (
    <div role={OrderDashboard.role}>
      <OrdersTable
        orders={orders}
        entity={entity}
        defaultSort='capture_date'
        pageSize={getPageSize()}
        pageCount={pageCount}
        tableClass="!min-w-full"
        tableColumns={TableColumns}
        totalOrderCount={totalOrderCount}
        withHeader={true}
        withDisclaimer={true}
        isFetching={isFetching}
        setOrdersPageIndex={setOrdersPageIndex}
      />
    </div>
  );
}

OrderDashboard.role = 'order-dashboard-component';
