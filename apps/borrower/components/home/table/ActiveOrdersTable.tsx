import React, { useMemo, useState } from 'react';
import {
  faChevronRight,
  faShoppingCart,
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';

import BaseTable from '@components/BaseTable';
import Loading from '@components/Loading';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useWindowSize } from '@hooks/useWindowSize';
import { DashboardTableColumns } from './DashboardTableColumns';

export default function ActiveOrdersTable() {
  const size = useWindowSize();
  const { orders, ordersLoading } = useBorrowerDeps();
  const [sorting, setSorting] = useState([
    { id: 'created_at', desc: true },
    { id: 'status', desc: true },
  ]);

  const activeOrders = orders
    ?.filter((i) => ['active', 'funded', 'created'].includes(i.product.status))
    .slice(0, 10);

  const data = useMemo(() => activeOrders || [], [ordersLoading]);
  const columns = React.useMemo(() => {
    return DashboardTableColumns.map((col) => ({
      ...col,
      meta: {
        ...col.meta,
        isVisible: size.width >= col.hideColumn || !col.hideColumn,
      },
    }));
  }, [size.width]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnVisibility: columns.reduce((acc, col) => {
        acc[col.id] = col.meta.isVisible;
        return acc;
      }, {}),
    },
    onSortingChange: setSorting,
  });

  return (
    <div
      role={ActiveOrdersTable.role}
      className="col-span-7 md:row-span-4 mx-2 md:mx-3 rounded-lg border border-gray-300 overflow-x-scroll"
    >
      <div className="flex flex-col sm:flex-row justify-between px-6 p-4">
        <div className="flex items-center gap-3 w-full">
          <FontAwesomeIcon
            icon={faShoppingCart}
            className="text-primary-blue text-base lg:text-xl hidden mid:inline"
          />
          <div className="flex flex-col w-full">
            <p className="text-lg md:text-xl font-bold">Active Orders</p>
            <div className="flex flex-col mid:flex-row mid:items-center justify-between w-full">
              <p className="text-sm text-primary/80">
                Most recent active orders. View orders page for all order data.
              </p>
              <Link
                href="/orders"
                className="py-1 mid:py-0 flex items-center gap-1 text-primary-blue-hover font-medium group text-sm min-w-24 max-h-max"
              >
                <span className="border-b border-transparent group-hover:border-primary-blue-hover">
                  View{' '}
                  {orders?.length > activeOrders?.length
                    ? 'More'
                    : 'Orders Page'}
                </span>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-[0.6rem] pt-0.5 font-bold"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
      {ordersLoading ? (
        <Loading className="w-14 h-14 my-20 !text-primary" />
      ) : (
        <BaseTable
          table={table}
          rowClass="!text-sm"
          usePagination={false}
          noDataFoundWarning="No active orders found."
        />
      )}
    </div>
  );
}

ActiveOrdersTable.role = 'active-orders-table-component';
