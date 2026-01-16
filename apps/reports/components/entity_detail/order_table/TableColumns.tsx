import Link from 'next/link';

import DocumentLink from '@components/DocumentLink';
import { formatCurrency } from '@lib/utils/formatters';
import { BuildStack } from './BuildColumnStack';
import OrderStatus from './OrderStatus';

export const TableColumns = [
  {
    id: 'capture_date',
    header: 'Date',
    hideColumn: 0,
    accessorFn: (row) => row.product?.capture_date,
    cell: ({ row }) => <BuildStack original={row.original} />,
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
          href={`/reports/orders/${value}`}
        >
          {value}
        </Link>
      );
    },
  },
  {
    id: 'term',
    header: 'Term',
    accessorFn: (row) => row.product?.installments,
    hideColumn: 1024,
    enableSorting: true,
    cell: ({ getValue }) => {
      const value = getValue();
      return value === 4 ? value * 2 + 'w' : value * 30 + 'd';
    },
  },
  {
    id: 'amount',
    header: 'Amount',
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
    header: 'Status',
    accessorFn: (row) => row.product?.status,
    filterFn: 'arrIncludesSome',
    hideColumn: 768,
    cell: ({ row }) => <OrderStatus status={row.original.product.status} order={row.original} />,
  },
  {
    id: 'agreement',
    header: 'Agreement',
    accessorKey: 'id',
    enableSorting: false,
    hideColumn: 856,
    cell: ({ row }) => (
      <DocumentLink
        buttonClass="cursor-pointer text-sm text-primary-blue hover:text-primary-blue-hover flex items-center"
        order={row.original}
        type="agreement"
        buttonText="Download"
      />
    ),
  },
  {
    id: 'isPastDue',
    accessorFn: (row) => row.product?.isPastDue,
    filterFn: 'equals',
    hideColumn: true,
  },
];
