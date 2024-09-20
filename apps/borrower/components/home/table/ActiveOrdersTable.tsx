import React, { useMemo } from 'react';
import { faShoppingCart } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';

import BaseTable from '@components/BaseTable';
import Loading from '@components/Loading';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { DashboardTableColumns } from './DashboardTableColumns';

export default function ActiveOrdersTable() {
  const { orders, ordersLoading } = useBorrowerDeps();

  const router = useRouter();
  const activeOrders = orders?.filter((i) =>
    ['active', 'funded', 'created'].includes(i.product.status)
  );

  const data = useMemo(() => activeOrders || [], [ordersLoading]);
  const columns = useMemo(() => DashboardTableColumns, []);
  const instance = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 5,
        sortBy: [
          { id: 'created_at', desc: true },
          { id: 'status', desc: true },
        ],
      },
      manualSortBy: true,
      disableSortBy: true,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div
      role={ActiveOrdersTable.role}
      className="col-span-5 md:row-span-4 mx-2 md:mx-3 rounded-lg border border-gray-300 overflow-x-scroll mb-10"
    >
      <div className="flex items-center gap-2.5 p-4">
        <FontAwesomeIcon
          icon={faShoppingCart}
          className="text-primary-blue text-base lg:text-xl"
        />
        <p className="text-lg md:text-xl font-bold">Active Orders</p>
      </div>
      {ordersLoading ? (
        <Loading className="w-14 h-14 my-20 !text-primary" />
      ) : (
        <BaseTable
          addRows={10}
          rowClass="!text-sm"
          tableInstance={instance}
          noDataFoundWarning="No active orders found."
          onClickHandler={(value) =>
            router.push(`/borrower/orders/${value.id}`)
          }
        />
      )}
    </div>
  );
}

ActiveOrdersTable.role = 'active-orders-table-component';
