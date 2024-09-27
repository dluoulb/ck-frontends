import { fromISO } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';

export const TableColumns = [
  {
    header: 'ID',
    accessorKey: 'id',
  },
  {
    header: 'Value Date',
    accessorKey: 'value_date',
    sortType: 'alphanumeric',
    sortUndefined: 'last' as 'last',
    cell: ({ row }) => {
      const original = row.original;
      if (!Object.keys(original).length) return '';

      return original.loan_id
        ? fromISO(original.payment_date).toLocaleString()
        : fromISO(original.value_date).toLocaleString();
    },
  },
  {
    header: 'Amount',
    accessorKey: 'amount',
    cell: ({ row }) => {
      const original = row.original;
      if (!Object.keys(original).length) return '';
      
      return original.loan_id
        ? formatCurrency(original.amount.cents / 100)
        : formatCurrency(original.amount);
    },
  },
  {
    header: 'Note',
    accessorKey: 'note',
    cell: ({ getValue }) => {
      return <div className="capitalize">{getValue()?.toLowerCase()}</div>;
    },
  },
  {
    header: 'Transaction Type',
    accessorKey: 'type',
    cell: ({ getValue }) => {
      return (
        <div className="capitalize">
          {getValue()?.toLowerCase().replace('_', ' ')}
        </div>
      );
    },
  },
];
