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
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useEntity } from '@contexts/EntityContext';
import { useWindowSize } from '@hooks/useWindowSize';
import AddNewUser from './AddNewUser';
import { UserTableColumns } from './table/UserTableColumns';

export default function Users() {
  const size = useWindowSize();
  const { entity } = useEntity();
  const { companyUsers, companyUsersLoading, companyUsersRefetching } =
    useBorrowerDeps();
  const [sorting, setSorting] = useState([{ id: 'role', desc: false }]);

  const data = useMemo(() => companyUsers || [], [companyUsers?.length]);
  const columns = React.useMemo(() => {
    return UserTableColumns.map((col) => ({
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
    pageCount: companyUsers?.length / 5,
    initialState: {
      pagination: {
        pageSize: 5,
        pageIndex: 0,
      },
    },
    state: {
      sorting,
      columnVisibility: columns.reduce((acc, col) => {
        acc[col.id] = col.meta.isVisible;
        return acc;
      }, {}),
    },
    onSortingChange: setSorting,
    manualPagination: true,
  });

  return (
    <div>
      <div className="border-y border-primary-gray-border px-8 py-6">
        <div className="text-sm font-medium text-tertiary-gray">
          <p>View your {entity?.type}'s list of users below.</p>
          <p>
            To add authorized users to place orders on behalf of {entity?.name},
            add a purchaser user.
          </p>
        </div>
      </div>
      <AddNewUser />
      {!companyUsers && (companyUsersLoading || companyUsersRefetching) ? (
        <Loading className="w-14 h-14 my-28" />
      ) : (
        <BaseTable
          table={table}
          rowClass="!text-sm"
          totalCount={companyUsers?.length}
          noDataFoundWarning="Error: Unable to retrieve users."
        />
      )}
    </div>
  );
}
