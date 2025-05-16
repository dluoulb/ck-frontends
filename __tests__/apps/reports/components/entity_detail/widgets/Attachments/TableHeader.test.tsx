import React from 'react';
import { render, screen } from '@testing-library/react';

import TableHeader from '@components/TableHeader';

describe('TableHeader Component', () => {
  test('displays document type tabs', () => {
    const table = {
      getState: jest.fn(() => ({
        globalFilter: '',
      })),
      setColumnFilters: jest.fn(),
      getRowModel: jest.fn(() => ({
        rows: [],
      })), 
    };

    const statusTabs = [
      { name: 'all', filter_value: '' },
      { name: 'Bank Statements', filter_value: 'bank_statements' },
      { name: 'Adverse Action', filter_value: 'adverse_action' },
      { name: 'Underwriting', filter_value: 'underwriting' },
      { name: 'Other', filter_value: 'misc' },
    ];

    render(
      <TableHeader
        table={table}
        statusTabs={statusTabs}
        active="all"
        setActive={jest.fn()}
      />
    );

    const tabs = screen.getAllByRole('listitem');
    expect(tabs).toHaveLength(5);
  });
});
