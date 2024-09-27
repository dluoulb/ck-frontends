import { DateTime } from 'luxon';

import { fromISO } from '@lib/utils/datetime_formatters';
import DownloadDocument from './DownloadDocument';

export const TableColumns = [
  {
    accessorKey: 'created_at',
    header: 'Created Date',
    enableSorting: true,
    cell: ({ getValue }) =>
      fromISO(getValue()).toLocaleString(DateTime.DATE_SHORT),
  },
  {
    accessorKey: 'file_type',
    header: 'Document Type',
    enableSorting: true,
    size: 48,
    cell: ({ getValue }) => {
      const value = getValue();
      return value === 'misc' ? (
        'Miscellaneous'
      ) : (
        <span className="capitalize">{value?.replace(/_/g, ' ')}</span>
      );
    },
  },
  {
    accessorKey: 'file_name',
    header: 'File Name',
    size: 72,
    enableSorting: true,
    cell: ({ getValue }) => <div className="truncate">{getValue()}</div>,
  },
  {
    accessorKey: 'id',
    header: 'Download',
    enableSorting: false,
    cell: ({ getValue }) => <DownloadDocument document_id={getValue()} />,
  },
];
