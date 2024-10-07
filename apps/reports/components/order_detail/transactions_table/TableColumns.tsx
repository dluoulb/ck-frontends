import { formatCurrency } from '@lib/utils/formatters';
import { BuildStack } from './BuildColumnStack';

export const TableColumns = [
  {
    id: 'id',
    header: 'ID',
    accessorKey: 'id',
    hideColumn: 640,
    meta: {},
  },
  {
    id: 'value_date',
    header: 'Value Date',
    accessorKey: 'value_date',
    sortType: 'alphanumeric',
    sortUndefined: 'last' as 'last',
    cell: ({ row }) => <BuildStack original={row?.original} />,
  },
  {
    id: 'amount',
    header: 'Amount',
    accessorKey: 'amount',
    hideColumn: 640,
    cell: ({ row }) => {
      const original = row.original;
      if (!Object.keys(original).length) return '';

      return original.loan_id
        ? formatCurrency(original.amount.cents / 100)
        : formatCurrency(original.amount);
    },
  },
  {
    id: 'note',
    header: 'Note',
    accessorKey: 'note',
    hideColumn: 1024,
    cell: ({ getValue }) => {
      return (
        <div className="capitalize">
          {getValue()?.toLowerCase().replaceAll('_', ' ')}
        </div>
      );
    },
  },
  {
    id: 'type',
    header: 'Transaction Type',
    accessorKey: 'type',
    hideColumn: 856,
    cell: ({ getValue }) => {
      return (
        <div className="capitalize">
          {getValue()?.toLowerCase().replaceAll('_', ' ')}
        </div>
      );
    },
  },
];
