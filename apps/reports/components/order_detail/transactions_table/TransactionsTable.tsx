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
import { TableColumns } from './TableColumns';

export default function TransactionsTable({ transactions, err }) {
  const [sorting, setSorting] = useState([{ id: 'value_date', desc: true }]);

  const data = useMemo(() => transactions || [], [transactions?.length]);
  const columns = useMemo(() => TableColumns, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    onSortingChange: setSorting,
  });

  if (!transactions) return <Loading className="w-14 h-14 my-16" />;

  return (
    <div
      role={TransactionsTable.role}
      className="col-span-full rounded-lg border border-black border-opacity-5 overflow-x-scroll my-6"
    >
      <div className="font-semibold tracking-wide text-lg my-3 sm:my-4 px-4 sm:px-6">
        Transactions
      </div>
      <BaseTable
        table={table}
        tableClass="w-full px-2 sm:px-6"
        totalCount={transactions?.length}
        noDataFoundWarning={
          err
            ? 'Error: Unable to retrieve order transactions.'
            : 'No transactions found.'
        }
      />
    </div>
  );
}

TransactionsTable.role = 'transactions-table-component';
