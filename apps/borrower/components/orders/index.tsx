import React from 'react';
import { useRouter } from 'next/router';

import Loading from '@components/Loading';
import OrdersTable from '@components/orders_table/OrdersTable';
import { useBorrowerDeps } from '@contexts/DependenciesContext';
import { useEntity } from '@contexts/EntityContext';
import { TableColumns } from './TableColumns';

export default function Orders() {
  const router = useRouter();
  const { entity, entityLoading } = useEntity();
  const { orders, ordersLoading, isLoading, pageCount } = useBorrowerDeps();

  if (isLoading || ordersLoading || entityLoading)
    return <Loading className="w-14 h-14 my-20" />;

  if (!entity) return;

  return (
    <div
      data-testid="container"
      className="my-4 md:my-6 mx-auto h-full"
      role={Orders.role}
    >
      <div className="mx-2 md:max-w-[90%] md:mx-auto h-full">
        <p className="text-2xl md:text-4xl font-bold text-primary capitalize">
          My Orders
        </p>
        <div className="my-4">
          <OrdersTable
            orders={orders}
            pageCount={pageCount}
            tableColumns={TableColumns}
            totalRows={orders?.length}
            pageSize={25}
            rowClass="text-sm"
            withHeader={true}
            onClickHandler={(value) =>
              router.push(`/borrower/orders/${value.id}`)
            }
          />
        </div>
      </div>
    </div>
  );
}

Orders.role = 'orders-page';
