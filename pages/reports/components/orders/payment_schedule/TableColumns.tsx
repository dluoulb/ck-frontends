import { fromISO } from '../../../../../lib/utils/datetime_formatters';
import { formatCurrency } from '../../../../../lib/utils/formatters';

export const TableColumns = [
  {
    Header: 'Due Date',
    accessor: 'due_date',
    Cell: ({ value }) => (value ? fromISO(value).toLocaleString() : ''),
  },
  {
    Header: 'Total',
    accessor: 'total_expected',
    Cell: ({ value }) => (value ? formatCurrency(value) : ''),
  },
  {
    Header: 'Principal Paid',
    accessor: 'principal_paid',
    Cell: ({ value }) => (value ? formatCurrency(value) : ''),
  },
  {
    Header: 'Fees',
    accessor: 'fees_paid',
    Cell: ({ value }) => (value ? formatCurrency(value) : ''),
  },
  {
    Header: 'State',
    accessor: 'status',
    Cell: ({ value }) => <span className="capitalize">{value}</span>,
  },
];
