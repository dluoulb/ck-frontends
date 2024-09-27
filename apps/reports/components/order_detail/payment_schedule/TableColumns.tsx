import { fromISO } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';

export const TableColumns = [
  {
    header: 'Due Date',
    accessorKey: 'due_date',
    enableSorting: true,
    cell: ({ getValue }) => {
      const value = getValue();
      if (!value) return '';

      return fromISO(value).toLocaleString();
    },
  },
  {
    header: 'Total',
    accessorKey: 'total_expected',
    enableSorting: true,
    cell: ({ getValue }) => {
      const value = getValue();
      if (!value) return '';
      return formatCurrency(value);
    },
  },
  {
    header: 'Principal Paid',
    accessorKey: 'principal_paid',
    enableSorting: true,
    cell: ({ getValue }) => {
      const value = getValue();
      if (!value) return '';
      return formatCurrency(value);
    },
  },
  {
    header: 'Fees',
    accessorKey: 'fees_paid',
    enableSorting: true,
    cell: ({ getValue }) => {
      const value = getValue();
      if (!value) return '';
      return formatCurrency(value);
    },
  },
  {
    header: 'State',
    accessorKey: 'status',
    enableSorting: true,
    cell: ({ getValue }) => <span className="capitalize">{getValue()}</span>,
  },
];
