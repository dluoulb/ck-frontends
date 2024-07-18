import React, { useMemo } from 'react';
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';

import BaseTable from '@components/BaseTable';
import Loading from '@components/Loading';
import { TableColumns } from './TableColumns';

export default function PSTable({ payment_schedule, err }) {
  const data = useMemo(() => payment_schedule || [], [payment_schedule]);
  const columns = useMemo(() => TableColumns, []);
  const sortTypes = React.useMemo(
    () => ({
      alphanumericFalsyLast(rowA, rowB, columnId) {
        const a = Number(rowA.values[columnId]);
        const b = Number(rowB.values[columnId]);

        return Number(a) - Number(b);
      },
    }),
    []
  );
  const instance = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 5,
        sortBy: [{ id: 'due_date', desc: true }],
      },
      sortTypes,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

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
        tableInstance={instance}
        noDataFoundWarning={
          err
            ? 'Error: Unable to retrieve payment schedule.'
            : 'No payment schedule found.'
        }
        tableClass="min-h-[21rem] w-full px-2 sm:px-6"
        addRows={6}
        fillTable={true}
      />
    </div>
  );
}

PSTable.role = 'payment-schedule-table-component';
