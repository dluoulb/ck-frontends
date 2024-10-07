import React from 'react';
import Link from 'next/link';

import { formatCurrency } from '@lib/utils/formatters';
import { BuildStack } from './BuildColumnStack';
import NextPayment from './NextPayment';
import OrderStatus from './OrderStatus';

export const DashboardTableColumns = [
  {
    id: 'created_at',
    header: 'Order Date',
    accessorKey: 'created_at',
    meta: {},
    cell: ({ row }) => <BuildStack original={row?.original} />,
  },
  {
    id: 'order_key',
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
    id: 'merchant_name',
    header: 'Merchant Name',
    hideColumn: 1280,
    accessorFn: (row) => row.merchant?.name,
  },
  {
    id: 'amount',
    header: 'Total Amount',
    accessorKey: 'amount',
    hideColumn: 640,
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
    hideColumn: 856,
    accessorFn: (row) => row.product?.status,
    cell: ({ row }) => <OrderStatus order={row.original} isTable={true} />,
  },
  {
    id: 'next_payment_date',
    header: 'Next Payment Date',
    hideColumn: 1280,
    accessorFn: (row) => row.product?.next_payment_date,
    cell: ({ row }) => <NextPayment order={row.original} />,
  },
];
