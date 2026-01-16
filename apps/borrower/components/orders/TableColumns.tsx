import React from 'react';
import Link from 'next/link';

import { formatInstallments } from '@lib/utils/formatters';
import { BuildStack } from './BuildColumnStack';
import NextPayment from '../home/table/NextPayment';
import OrderStatus from '../home/table/OrderStatus';
import OrderTotalColumn from '../home/table/OrderTotalColumn';
import TermsColumn from '../home/table/TermsColumn';

const TermsCell = ({ order, openModalForLoan }) => {
  const isEditable = order.terms_editable;
  const installments = Number(order.product?.installments ?? 0);
  const label = formatInstallments(installments);

  if (isEditable) {
    return <TermsColumn order={order} openModalForLoan={openModalForLoan} />;
  }

  return <span className="font-medium">{label}</span>;
};

export const TableColumns = (openModalForLoan) => [
  {
    id: 'created_at',
    header: 'Date',
    accessorKey: 'created_at',
    hideColumn: 0,
    cell: ({ row }) => <BuildStack original={row?.original} openModalForLoan={openModalForLoan} />,
  },
  {
    id: 'order_key',
    header: 'ID',
    accessorKey: 'order_key',
    hideColumn: 640,
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
    id: 'merchant_info',
    header: 'Merchant',
    hideColumn: 640,
    accessorFn: (row) => row.merchant?.name || '',
    cell: ({ row }) => {
      const merchant = row.original.merchant?.name || '—';
      const merchantOrderId = row.original.merchant_order_id || '—';
      return (
        <div className="flex flex-col leading-tight">
          <span className="font-medium">{merchant}</span>
          <span className="text-xs text-tertiary-gray">{merchantOrderId}</span>
        </div>
      );
    },
  },
  {
    id: 'amount_and_balance',
    header: 'Order Total',
    hideColumn: 640,
    accessorFn: (row) => row.amount,
    cell: ({ row }) => <OrderTotalColumn order={row.original} />,
    sortingFn: (rowA, rowB) => {
      const a = parseFloat(rowA.original.amount) || 0;
      const b = parseFloat(rowB.original.amount) || 0;
      return a - b;
    },
  },
  {
    id: 'next_payment',
    header: 'Next Payment',
    hideColumn: 640,
    accessorFn: (row) => row.product?.next_payment_due_amount,
    cell: ({ row }) => <NextPayment order={row.original} />,
  },
  {
    id: 'terms',
    header: 'Terms',
    hideColumn: 640,
    accessorFn: (row) => row.product?.installments,
    cell: ({ row }) => <TermsCell order={row.original} openModalForLoan={openModalForLoan} />,
  },
  {
    id: 'status',
    header: 'Status',
    hideColumn: 640,
    accessorFn: (row) => row.product?.status,
    filterFn: (row, columnId, filterValue) => {
      return filterValue.includes(row.original.product?.status);
    },
    cell: ({ row }) => <OrderStatus order={row.original} isTable={true} />,
  },
  {
    id: 'isPastDue',
    accessorFn: (row) => row.product?.isPastDue,
    filterFn: 'equals',
    hideColumn: true,
  },
];
