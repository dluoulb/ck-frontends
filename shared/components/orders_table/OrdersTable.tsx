import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQueryClient } from '@tanstack/react-query';
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
import UpdateTermsModalWrapper from '../../../apps/borrower/components/terms/UpdateTermsModalWrapper';

function isColumnVisible(hideColumn, viewportWidth) {
  if (typeof hideColumn === 'number') {
    return viewportWidth >= hideColumn;
  }

  return hideColumn !== true;
}

export default function OrdersTable({
  orders,
  entity,
  pageSize,
  pageCount,
  rowCount,
  tableClass = '',
  tableColumns,
  rowClass = '',
  withHeader = false,
  withDisclaimer = false,
  onClickHandler = null,
  isFetching = false,
  setOrdersPageIndex = (pageIndex) => {},
  defaultSort = '',
  refetchOrders = null,
}) {
  const queryClient = useQueryClient();
  const size = useWindowSize();
  const [active, setActive] = useState('all');
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([{ id: defaultSort, desc: true }]);
  const [startStep, setStartStep] = useState(1);

  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const toggleTermsModal = () => setIsTermsModalOpen((prev) => !prev);
  const openModalForLoan = useCallback((loan) => {
    setSelectedLoan(loan);
    setIsTermsModalOpen(true);
    setStartStep(2);
  }, []);

  const data = useMemo(() => orders || [], [orders, orders?.length]);
  const columns = useMemo(() => {
    return tableColumns(openModalForLoan).map((col) => ({
      ...col,
      meta: {
        ...col.meta,
        isVisible: isColumnVisible(col.hideColumn, size.width),
      },
    }));
  }, [size.width, openModalForLoan]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    rowCount,
    initialState: {
      columnVisibility: { isPastDue: false },
      pagination: {
        pageSize: pageSize,
        pageIndex: 0,
      },
    },
    state: {
      sorting,
      globalFilter,
      columnFilters,
      columnVisibility: columns.reduce((acc, col) => {
        acc[col.id] = col.meta.isVisible;
        return acc;
      }, {}),
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    manualPagination: true,
  });

  const { pageIndex } = table.getState().pagination;
  const isPageCached = queryClient.getQueryData([
    'orders',
    entity,
    entity?.type,
    pageIndex,
  ]);

  const getNoDataMessage = () => {
    const filter = active === 'all' ? '' : active;
    const pageMessage = !pageCount ? '' : ' or try another page.';

    // return `No ${filter} orders found. Please try additional filters${pageMessage}`;
    return 'No orders found.';
  };

  useEffect(() => {
    setOrdersPageIndex(pageIndex);
  }, [pageIndex]);

  useEffect(() => {
    if (!isTermsModalOpen) {
      setStartStep(1);
    }
  }, [isTermsModalOpen]);

  return (
    <>
      <div role={OrdersTable.role}>
        {withDisclaimer && (
          <div className="py-4 px-8 flex items-center gap-2 text-sm font-medium border-b border-primary-gray-border">
            <FontAwesomeIcon icon={faInfoCircle} />
            <p>
              The amount displayed is the principal loan amount not including
              interest & fees
            </p>
          </div>
        )}
        <div className="col-span-full border border-border-gray rounded-md">
          {withHeader && (
            <TableHeader
              table={table}
              active={active}
              setActive={setActive}
              tabClass="border-transparent"
              headerClass="px-2"
              filterType="status"
            />
          )}
          <BaseTable
            table={table}
            rowClass={rowClass}
            isFetching={isFetching}
            tableClass={tableClass}
            isPageCached={!!isPageCached}
            onClickHandler={onClickHandler}
            noDataFoundWarning={getNoDataMessage()}
          />
        </div>
      </div>
      {selectedLoan && (
        <UpdateTermsModalWrapper
          loan={selectedLoan}
          isTermsModalOpen={isTermsModalOpen}
          toggleTermsModal={toggleTermsModal}
          startStep={startStep}
          refetchOrders={refetchOrders}
        />
      )}
    </>
  );
}

OrdersTable.role = 'orders-table-component';
