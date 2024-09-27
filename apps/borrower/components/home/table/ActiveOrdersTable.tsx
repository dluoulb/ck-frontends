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
import { useRouter } from 'next/router';

import BaseTable from '@components/BaseTable';
import Loading from '@components/Loading';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { DashboardTableColumns } from './DashboardTableColumns';

export default function ActiveOrdersTable() {
  const router = useRouter();
  const { orders, ordersLoading } = useBorrowerDeps();
  const [sorting, setSorting] = useState([
    { id: 'created_at', desc: true },
    { id: 'status', desc: true },
  ]);

  const activeOrders = orders
    ?.filter((i) => ['active', 'funded', 'created'].includes(i.product.status))
    .slice(0, 10);

  const data = useMemo(() => activeOrders || [], [ordersLoading]);
  const columns = useMemo(() => DashboardTableColumns, []);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  });

  return (
    <div
      role={ActiveOrdersTable.role}
      className="col-span-5 md:row-span-4 mx-2 md:mx-3 rounded-lg border border-gray-300 overflow-x-scroll mb-10"
    >
      <div className="flex justify-between p-4">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon
            icon={faShoppingCart}
            className="text-primary-blue text-base lg:text-xl"
          />
          <div className="flex flex-col">
            <p className="text-lg md:text-xl font-bold">Active Orders</p>
            <p className="text-sm text-primary/80">
              Most recent active orders. View orders page for all order data.
            </p>
          </div>
        </div>
        <Link
          href="/borrower/orders"
          className="flex items-center gap-1 text-primary-blue-hover font-medium group text-xs md:text-sm !py-0 w-24 max-h-max"
        >
          <span className="border-b border-transparent group-hover:border-primary-blue-hover">
            View{' '}
            {orders?.length > activeOrders?.length ? 'More' : 'Orders Page'}
          </span>
          <FontAwesomeIcon
            icon={faChevronRight}
            className="text-[0.6rem] pt-0.5 font-bold"
          />
        </Link>
      </div>
      {ordersLoading ? (
        <Loading className="w-14 h-14 my-20 !text-primary" />
      ) : (
        <BaseTable
          table={table}
          rowClass="!text-sm"
          tableClass="!min-w-max"
          usePagination={false}
          noDataFoundWarning="No active orders found."
        />
      )}
    </div>
  );
}

ActiveOrdersTable.role = 'active-orders-table-component';
