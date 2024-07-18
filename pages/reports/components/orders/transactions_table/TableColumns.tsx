import { fromISO } from '../../../../../lib/utils/datetime_formatters';
import { formatCurrency } from '../../../../../lib/utils/formatters';

export const TableColumns = [
  {
    Header: 'ID',
    accessor: 'id',
  },
  {
    Header: 'Value Date',
    accessor: 'value_date',
    sortType: 'alphanumericFalsyLast',
    Cell: ({ row: { original } }) => {
      if (!Object.keys(original).length) return '';
      return original.loan_id
        ? fromISO(original.payment_date).toLocaleString()
        : fromISO(original.value_date).toLocaleString();
    },
  },
  {
    Header: 'Amount',
    accessor: 'amount',
    Cell: ({ row: { original } }) => {
      if (!Object.keys(original).length) return '';
      return original.loan_id
        ? formatCurrency(original.amount.cents / 100)
        : formatCurrency(original.amount);
    },
  },
  {
    Header: 'Note',
    accessor: 'note',
    Cell: ({ value }) => {
      return <div className="capitalize">{value?.toLowerCase()}</div>;
    },
  },
  {
    Header: 'Transaction Type',
    accessor: 'type',
    Cell: ({ value }) => {
      return (
        <div className="capitalize">
          {value?.toLowerCase().replace('_', ' ')}
        </div>
      );
    },
  },
];
