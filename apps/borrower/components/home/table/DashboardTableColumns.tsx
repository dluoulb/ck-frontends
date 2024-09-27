import React from 'react';
import { DateTime } from 'luxon';

import { fromISO } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';
import { NextPayment, OrderStatus } from './';
import Link from 'next/link';

export const DashboardTableColumns = [
  {
    header: 'Order Date',
    accessorKey: 'created_at',
    id: 'created_at',
    cell: ({ getValue }) =>
      fromISO(getValue()).toLocaleString(DateTime.DATE_SHORT),
  },
  {
    header: 'Order Key',
    accessorKey: 'order_key',
    hideColumn: 1024,
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <Link
          className="text-primary-blue font-semibold cursor-pointer hover:text-primary-blue-hover"
          href={`/borrower/orders/${value}`}
        >
          {value}
        </Link>
      );
    },
  },
  {
    header: 'Merchant Name',
    accessorFn: (row) => row.merchant?.name,
  },
  {
    header: 'Total Amount',
    accessorKey: 'amount',
    enableSorting: true,
    cell: ({ getValue }) => formatCurrency(getValue()),
    sortingFn: (rowA, rowB, columnId) => {
      const a = parseFloat(rowA.getValue(columnId)) || 0;
      const b = parseFloat(rowB.getValue(columnId)) || 0;
      return a - b;
    },
  },
  {
    id: 'status',
    header: 'Order Status',
    accessorFn: (row) => row.product?.status,
    cell: ({ row }) => <OrderStatus order={row.original} isTable={true} />,
  },
  {
    header: 'Next Payment Date',
    accessorFn: (row) => row.product?.next_payment_date,
    cell: ({ row }) => <NextPayment order={row.original} />,
  },
];
