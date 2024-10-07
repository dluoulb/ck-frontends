import React, { useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import BaseTable from '@components/BaseTable';
import Loading from '@components/Loading';
import { useWindowSize } from '@hooks/useWindowSize';
import { TableColumns } from './TableColumns';

export default function PSTable({ payment_schedule, err }) {
  const size = useWindowSize();
  const [sorting, setSorting] = useState([{ id: 'due_date', desc: true }]);

  const data = useMemo(() => payment_schedule || [], [payment_schedule]);
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
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
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
  });

  if (!payment_schedule) return <Loading className="w-14 h-14 my-16" />;

  return (
    <div
      role={PSTable.role}
      className="col-span-full rounded-lg border border-black border-opacity-5 overflow-x-scroll my-6"
    >
      <div className="font-semibold tracking-wide text-lg my-3 sm:my-4 px-4 sm:px-6">
        Payment Schedule
      </div>
      <BaseTable
        table={table}
        tableClass="w-full px-2 sm:px-6 text-sm"
        totalCount={payment_schedule?.length}
        noDataFoundWarning={
          err
            ? 'Error: Unable to retrieve payment schedule.'
            : 'No payment schedule found.'
        }
      />
    </div>
  );
}

PSTable.role = 'payment-schedule-table-component';
