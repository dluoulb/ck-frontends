import React, { useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import BaseTable from '@components/BaseTable';
import Loading from '@components/Loading';
import { useEntity } from '@contexts/EntityContext';
import useDocuments from '@hooks/useDocuments';
import { DocumentTableColumns } from './DocumentTableColumns';

export default function DocumentList() {
  const { entity } = useEntity();
  const [sorting, setSorting] = useState([]);

  const { documents, documentsLoading } = useDocuments(entity);

  const data = useMemo(() => documents || [], [documents?.length]);
  const columns = useMemo(() => DocumentTableColumns, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: data.length / 10,
    initialState: {
      pagination: { pageSize: 10, pageIndex: 0 },
    },
    state: { sorting },
    onSortingChange: setSorting,
    manualPagination: true,
  });

  return (
    <div className="relative rounded-md border-t border-x border-primary-gray-border shadow-sm mt-4 md:mt-8 min-h-max">
      <div className="py-8 px-6 border-b border-primary-gray-border">
        <p className="text-2xl font-bold text-primary">
          Previously Uploaded Documents
        </p>
      </div>

      <div className="p-6 overflow-x-auto">
        {documentsLoading ? (
          <Loading className="w-14 h-14 my-28" />
        ) : (
          <BaseTable
            table={table}
            rowClass="!text-sm"
            noDataFoundWarning="No documents found."
          />
        )}
      </div>
    </div>
  );
}
