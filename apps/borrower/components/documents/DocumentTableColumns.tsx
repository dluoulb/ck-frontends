import React from 'react';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DownloadDocument from '@apps/reports/components/entity_detail/widgets/Attachments/table/DownloadDocument';
import { reformatDate } from '@lib/utils/datetime_formatters';

const documentTypesMap = {
  bank_statements: 'Bank Statement',
  invoice: 'Invoice',
  id_proof: 'ID Proof',
  tax_document: 'Tax Document',
};

export const DocumentTableColumns = [
  {
    id: 'file_name',
    accessorKey: 'attributes.file_name',
    header: 'DOCUMENT',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FontAwesomeIcon
          icon={faFileLines}
          className="text-gray-400 flex-shrink-0"
        />
        <span className="break-words">{row.original.attributes.file_name}</span>
      </div>
    ),
  },
  {
    id: 'file_type',
    accessorKey: 'attributes.file_type',
    header: 'TYPE',
    cell: ({ row }) =>
      documentTypesMap[row.original.attributes.file_type] || 'Other',
  },
  {
    id: 'created_at',
    accessorKey: 'attributes.created_at',
    header: 'DATE UPLOADED',
    cell: ({ row }) => reformatDate(row.original.attributes.created_at),
  },
  {
    id: 'download',
    header: 'DOWNLOAD',
    cell: ({ row }) => <DownloadDocument document_id={row.original.id} />,
    enableSorting: false,
  },
];
