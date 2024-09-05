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
import Loading from '@components/Loading';
import TableHeader from './TableHeader';

export default function OrdersTable({
  orders,
  ordersLoading,
  pageCount,
  fetchData,
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

  const onFetchDataDebounced = useAsyncDebounce(fetchData, 250);

  // If provided with a data fetching function for any server side pagination / filtering etc,
  // listen for related changes and load new page data.
  useEffect(() => {
    if (!fetchData) return;

    onFetchDataDebounced({ pageIndex });
  }, [pageIndex]);

  if (!orders || ordersLoading) return <Loading className="w-14 h-14 my-16" />;

  return (
    <div
      role={OrdersTable.role}
      className="col-span-full rounded-lg border border-primary-border-gray overflow-x-scroll"
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
