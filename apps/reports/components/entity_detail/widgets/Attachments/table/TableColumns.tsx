import { DateTime } from 'luxon';

import { fromISO } from '@lib/utils/datetime_formatters';
import { BuildStack } from './BuildColumnStack';
import DownloadDocument from './DownloadDocument';

export const TableColumns = [
  {
    id: 'created_at',
    accessorKey: 'created_at',
    header: 'Created Date',
    hideColumn: 856,
    meta: {},
    enableSorting: true,
    cell: ({ getValue }) =>
      fromISO(getValue()).toLocaleString(DateTime.DATE_SHORT),
  },
  {
    id: 'file_type',
    accessorKey: 'file_type',
    hideColumn: 768,
    header: 'Document Type',
    meta: {},
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
    id: 'file_name',
    accessorKey: 'file_name',
    header: 'File Name',
    meta: {},
    size: 72,
    enableSorting: true,
    cell: ({ row }) => <BuildStack original={row?.original} />,
  },
  {
    id: 'download',
    accessorKey: 'id',
    meta: {},
    hideColumn: 1024,
    header: 'Download',
    enableSorting: false,
    cell: ({ getValue }) => <DownloadDocument document_id={getValue()} />,
  },
];
