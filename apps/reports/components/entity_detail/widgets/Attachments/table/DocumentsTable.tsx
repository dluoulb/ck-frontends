import React, { useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import BaseTable from '@components/BaseTable';
import TableHeader from '@components/TableHeader';
import { useWindowSize } from '@hooks/useWindowSize';
import { TableColumns } from './TableColumns';

export default function DocumentsTable({ documents }) {
  const size = useWindowSize();
  const [active, setActive] = useState('all');
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([{ id: 'created_at', desc: true }]);

  const statusTabs = [
    {
      name: 'all',
      filter_value: '',
    },
    {
      name: 'Bank Statements',
      filter_value: 'bank_statements',
    },
    {
      name: 'Adverse Action',
      filter_value: [
        'manual_adverse_action_notice',
        'adverse_action_reason_for_denial',
      ],
    },
    {
      name: 'Underwriting',
      filter_value: 'underwriting_other',
    },
    {
      name: 'Other',
      filter_value: 'misc',
    },
  ];

  const data = useMemo(() => documents || [], [documents?.length]);
  const columns = React.useMemo(() => {
    return TableColumns.map((col) => ({
      ...col,
      meta: {
        ...col.meta,
        isVisible: size.width >= col.hideColumn || !col.hideColumn,
      },
    }));
  }, [size.width]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility: columns.reduce((acc, col) => {
        acc[col.id] = col.meta.isVisible;
        return acc;
      }, {}),
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <div className="flex flex-col max-w-full capitalize">
      <TableHeader
        statusTabs={statusTabs}
        table={table}
        active={active}
        setActive={setActive}
        filterType="file_type"
      />
      <BaseTable
        table={table}
        headerClass="!py-3 !px-4"
        rowClass="!text-sm !py-3 !px-4"
        tableClass="mid:!min-w-max lg:!min-w-full"
        noDataFoundWarning={
          active === 'all'
            ? 'No documents found.'
            : `No ${active} documents found.`
        }
      />
    </div>
  );
}
