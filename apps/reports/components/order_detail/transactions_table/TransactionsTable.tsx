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

export default function TransactionsTable({ transactions, err }) {
  const data = useMemo(() => transactions || [], [transactions?.length]);
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
        pageSize: transactions?.length < 5 ? transactions?.length : 5,
        sortBy: [{ id: 'value_date', desc: true }],
      },
      sortTypes,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

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
        tableInstance={instance}
        noDataFoundWarning={
          err
            ? 'Error: Unable to retrieve order transactions.'
            : 'No transactions found.'
        }
        tableClass="w-full px-2 sm:px-6"
        addRows={5}
      />
    </div>
  );
}

TransactionsTable.role = 'transactions-table-component';
