import React, { useEffect, useMemo, useState } from 'react';
import {
  useAsyncDebounce,
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from 'react-table';

import BaseTable from '@components/BaseTable';
import TableHeader from './TableHeader';

export default function OrdersTable({
  orders,
  pageCount,
  tableColumns,
  onClickHandler = null,
  totalRows,
  rowClass = '',
  pageSize,
  withHeader = false,
}) {
  const [active, setActive] = useState('all');
  const data = useMemo(() => orders || [], [orders?.length]);
  const columns = useMemo(() => tableColumns, []);
  const instance = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: pageSize,
        sortBy: [{ id: 'disbursement_date', desc: true }],
      },
      manualSortBy: true,
      disableSortBy: true,
      manualPagination: true,
      autoResetPage: false,
      pageCount: pageCount,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const { pageIndex } = instance.state;

  const onFetchDataDebounced = useAsyncDebounce(() => {}, 250);

  useEffect(() => {
    onFetchDataDebounced();
  }, [pageIndex, onFetchDataDebounced]);

  return (
    <div
      role={OrdersTable.role}
      className="col-span-full rounded-lg border border-primary-gray-border overflow-x-scroll"
    >
      {withHeader && (
        <TableHeader
          tableInstance={instance}
          active={active}
          setActive={setActive}
        />
      )}
      <BaseTable
        tableInstance={instance}
        noDataFoundWarning="No Orders Found."
        onClickHandler={onClickHandler}
        totalRows={totalRows}
        rowClass={rowClass}
      />
    </div>
  );
}

OrdersTable.role = 'orders-table-component';
