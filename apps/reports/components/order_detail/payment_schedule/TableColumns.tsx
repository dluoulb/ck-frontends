import { formatCurrency } from '@lib/utils/formatters';
import { BuildStack } from './BuildColumnStack';

export const TableColumns = [
  {
    id: 'due_date',
    header: 'Due Date',
    accessorKey: 'due_date',
    meta: {},
    enableSorting: true,
    cell: ({ row }) => <BuildStack original={row.original} />,
  },
  {
    id: 'total_expected',
    header: 'Total',
    accessorKey: 'total_expected',
    hideColumn: 640,
    enableSorting: true,
    cell: ({ getValue }) => {
      const value = getValue();
      if (!value) return '';
      return formatCurrency(value);
    },
  },
  {
    id: 'principal_paid',
    header: 'Principal Paid',
    accessorKey: 'principal_paid',
    hideColumn: 640,
    enableSorting: true,
    cell: ({ getValue }) => {
      const value = getValue();
      if (!value) return '';
      return formatCurrency(value);
    },
  },
  {
    id: 'fees_paid',
    header: 'Fees',
    accessorKey: 'fees_paid',
    hideColumn: 768,
    enableSorting: true,
    cell: ({ getValue }) => {
      const value = getValue();
      if (!value) return '';
      return formatCurrency(value);
    },
  },
  {
    id: 'status',
    header: 'Status',
    hideColumn: 480,
    accessorKey: 'status',
    enableSorting: true,
    cell: ({ getValue }) => <span className="capitalize">{getValue()}</span>,
  },
];
