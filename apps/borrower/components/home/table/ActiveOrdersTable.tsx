import React, { useCallback, useMemo, useState } from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';

import BaseTable from '@components/BaseTable';
import OutlineButton from '@components/buttons/OutlineButton';
import Loading from '@components/Loading';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useWindowSize } from '@hooks/useWindowSize';
import { DashboardTableColumns } from './DashboardTableColumns';
import UpdateTermsModalWrapper from '../../terms/UpdateTermsModalWrapper';

export default function ActiveOrdersTable() {
  const size = useWindowSize();
  const { orders, ordersLoading } = useBorrowerDeps();
  const [sorting, setSorting] = useState([
    { id: 'created_at', desc: true },
    { id: 'status', desc: true },
  ]);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const toggleTermsModal = () => setIsTermsModalOpen((prev) => !prev);
  const openModalForLoan = useCallback((loan) => {
    setSelectedLoan(loan);
    setIsTermsModalOpen(true);
  }, []);

  const activeOrders = useMemo(() => {
    return (
      orders
        ?.filter((i) =>
          ['active', 'funded', 'created'].includes(i.product.status)
        )
        .slice(0, 10) || []
    );
  }, [orders]);

  const data = useMemo(() => activeOrders, [activeOrders]);
  const columns = useMemo(() => {
    return DashboardTableColumns(openModalForLoan).map((col) => ({
      ...col,
      meta: {
        ...col.meta,
        isVisible: size.width >= col.hideColumn || !col.hideColumn,
      },
    }));
  }, [size.width, openModalForLoan]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnVisibility: columns.reduce((acc, col) => {
        acc[col.id] = col.meta.isVisible;
        return acc;
      }, {}),
    },
    onSortingChange: setSorting,
  });

  return (
    <>
      <div role={ActiveOrdersTable.role} className="col-span-7 md:row-span-4">
        <div className="flex flex-col sm:flex-row justify-between pb-2">
          <div className="flex items-center gap-3 w-full">
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between w-full">
                <p className="text-xl font-medium">Active Orders</p>
                <Link
                  href="/orders"
                  className="py-1 mid:py-0 flex items-center gap-1 text-primary-blue-hover font-medium group text-sm min-w-24 max-h-max"
                >
                  <OutlineButton
                    ariaLabel="export-payment-history"
                    buttonText="View All Orders"
                    buttonColor="bg-white !text-primary !font-medium border border-border-grey !rounded-[8px]"
                    hoverClass="hover:bg-gray-100"
                    containerClass="2xs:max-w-max md:max-w-auto"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
        {ordersLoading ? (
          <Loading className="w-14 h-14 my-20 !text-primary" />
        ) : (
          <div className="overflow-hidden border border-border-gray rounded-md">
            <BaseTable
              table={table}
              rowClass="!text-sm bg-white"
              usePagination={false}
              noDataFoundWarning="No active orders found."
            />
          </div>
        )}
      </div>
      {selectedLoan && (
        <UpdateTermsModalWrapper
          loan={selectedLoan}
          isTermsModalOpen={isTermsModalOpen}
          toggleTermsModal={toggleTermsModal}
        />
      )}
    </>
  );
}

ActiveOrdersTable.role = 'active-orders-table-component';
