import React, { useMemo, useState } from 'react';
import { useFilters, useGlobalFilter, useSortBy, useTable } from 'react-table';
import BaseTable from '@components/BaseTable';

import { TableColumns } from './TableColumns';
import TableHeader from './TableHeader';

export default function DocumentsTable({ documents }) {
  const [active, setActive] = useState('all');

  const statusTabs = [
    {
      name: 'all',
      filter_value: '',
    },
    {
      name: 'Bank Statements',
      filter_value: 'bank_statements',
    },
    {
      name: 'Adverse Action',
      filter_value: [
        'manual_adverse_action_notice',
        'adverse_action_reason_for_denial',
      ],
    },
    {
      name: 'Underwriting',
      filter_value: 'underwriting_other',
    },
    {
      name: 'Other',
      filter_value: 'misc',
    },
  ];

  const data = useMemo(() => documents || [], [documents?.length]);
  const columns = useMemo(() => TableColumns, []);
  const instance = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: [{ id: 'created_at', desc: true }],
      },
      manualSortBy: true,
      disableSortBy: true,
    },
    useFilters,
    useGlobalFilter,
    useSortBy
  );

  return (
    <div className="flex flex-col max-w-full">
      <TableHeader
        statusTabs={statusTabs}
        tableInstance={instance}
        active={active}
        setActive={setActive}
      />
      <div className="max-h-84 sm:max-h-64 overflow-y-scroll cursor-ns-resize">
        <BaseTable
          tableInstance={instance}
          noDataFoundWarning={
            active === 'all'
              ? 'No documents found.'
              : `No ${active} documents found.`
          }
          rowClass="!text-sm !py-3 !px-4"
          headerClass="!py-3 !px-4"
        />
      </div>
    </div>
  );
}
