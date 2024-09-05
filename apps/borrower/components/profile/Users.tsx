import React, { useMemo } from 'react';
import { usePagination, useSortBy, useTable } from 'react-table';

import BaseTable from '@components/BaseTable';
import Loading from '@components/Loading';
import { useBorrowerDeps } from '@contexts';
import AddNewUser from './AddNewUser';
import { UserTableColumns } from './table/UserTableColumns';

export default function Users() {
  const { entity, companyUsers, companyUsersLoading, companyUsersRefetching } =
    useBorrowerDeps();

  const data = useMemo(() => companyUsers || [], [companyUsers?.length]);
  const columns = useMemo(() => UserTableColumns, []);
  const instance = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [{ id: 'role', desc: false }],
        pageSize: 5,
      },
    },
    useSortBy,
    usePagination
  );

  return (
    <div>
      <div className="border-y border-primary-border-gray px-8 py-6">
        <div className="font-bold text-xl flex items-center gap-2">
          <p className="text-primary-blue-hover">Users</p>
        </div>
        <div className="text-sm font-medium text-tertiary-gray">
          <p>View your {entity?.type}'s list of users below.</p>
          <p>
            To add authorized users to place orders on behalf of {entity?.name},
            add a purchaser user.
          </p>
        </div>
      </div>
      <AddNewUser />
      {companyUsersLoading || companyUsersRefetching ? (
        <Loading className="w-14 h-14 my-14" />
      ) : (
        <BaseTable
          tableInstance={instance}
          noDataFoundWarning="Error: Unable to retrieve users."
          rowClass="text-sm"
        />
      )}
    </div>
  );
}
