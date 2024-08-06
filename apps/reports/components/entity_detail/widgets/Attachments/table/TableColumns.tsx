import { DateTime } from 'luxon';

import { fromISO } from '@lib/utils/datetime_formatters';
import DownloadDocument from './DownloadDocument';

function multiValueFilter(rows, columnIds, filterValue) {
  if (filterValue.length === 0) return rows;
  return rows.filter((row) => filterValue.includes(row.values[columnIds]));
}

export const TableColumns = [
  {
    Header: 'Created Date',
    accessor: 'created_at',
    id: 'created_at',
    Cell: ({ value }) => fromISO(value).toLocaleString(DateTime.DATE_SHORT),
  },
  {
    Header: 'Document Type',
    accessor: 'file_type',
    className: 'max-w-48 truncate',
    filter: multiValueFilter,
    Cell: ({ value }) =>
      value === 'misc' ? (
        'Miscellaneous'
      ) : (
        <span className="capitalize">{value.replace(/_/g, ' ')}</span>
      ),
  },
  {
    Header: 'File Name',
    accessor: 'file_name',
    className: 'max-w-72 truncate',
  },
  {
    Header: 'Download',
    accessor: 'id',
    Cell: ({ value }) => <DownloadDocument document_id={value} />,
  },
];
