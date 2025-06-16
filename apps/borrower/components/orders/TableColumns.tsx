import React from 'react';
import { faEdit } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import { formatCurrency } from '@lib/utils/formatters';
import { BuildStack } from './BuildColumnStack';
import NextPayment from '../home/table/NextPayment';
import OrderStatus from '../home/table/OrderStatus';

export const TableColumns = (openModalForLoan) => [
  {
    id: 'created_at',
    header: 'Order Date',
    accessorKey: 'created_at',
    hideColumn: 0,
    cell: ({ row }) => <BuildStack original={row?.original} />,
  },
  {
    id: 'order_key',
    header: 'Order Key',
    accessorKey: 'order_key',
    hideColumn: 1280,
    cell: ({ getValue }) => {
      const value = getValue();
      return (
        <Link
          className="text-primary-blue font-semibold cursor-pointer hover:text-primary-blue-hover"
          href={`/orders/${value}`}
        >
          {value}
        </Link>
      );
    },
  },
  {
    id: 'merchant_name',
    header: 'Merchant Name',
    hideColumn: 1575,
    meta: {},
    accessorFn: (row) => row.merchant?.name,
  },
  {
    id: 'merchant_order_id',
    header: 'Merchant Order ID',
    accessorKey: 'merchant_order_id',
    hideColumn: 1575,
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
    id: 'total_balance',
    header: 'Remaining Balance',
    accessorKey: 'total_balance',
    hideColumn: 640,
    cell: ({ getValue }) => formatCurrency(getValue()),
  },
  {
    id: 'status',
    header: 'Order Status',
    hideColumn: 856,
    accessorFn: (row) => row.product?.status,
    filterFn: (row, columnId, filterValue) => {
      return filterValue.includes(row.original.product?.status);
    },
    cell: ({ row }) => <OrderStatus order={row.original} isTable={true} />,
  },
  {
    id: 'terms',
    header: 'Payment Terms',
    hideColumn: 1536,
    accessorFn: (row) => row.product?.installments,
    cell: ({ row }) => {
      return (
        <div
          className={
            row.original.terms_editable
              ? 'flex items-center gap-2 cursor-pointer'
              : 'flex items-center gap-2'
          }
          onClick={() =>
            row.original.terms_editable && openModalForLoan(row.original)
          }
        >
          <span>{row.original.product?.installments}</span>
          {row.original.terms_editable && (
            <FontAwesomeIcon icon={faEdit} className="text-gray-400 w-4 h-4" />
          )}
        </div>
      );
    },
  },
  {
    id: 'next_payment_date',
    header: 'Next Payment Date',
    hideColumn: 1536,
    accessorFn: (row) => row.product?.next_payment_date,
    cell: ({ row }) => <NextPayment order={row.original} type="date" />,
  },
  {
    id: 'next_payment_amount',
    header: 'Next Payment Amount',
    hideColumn: 1536,
    accessorFn: (row) => row.product?.next_payment_amount,
    cell: ({ row }) => <NextPayment order={row.original} type="amount" />,
  },
  {
    id: 'isPastDue',
    accessorFn: (row) => row.product?.isPastDue,
    filterFn: 'equals',
    hideColumn: true,
  },
];
