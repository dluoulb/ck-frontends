import React from 'react';
import classNames from 'classnames';

import { formatPhoneNumber, normalizePhone } from '@lib/utils/formatters';
import { BuildStack } from './BuildColumnStack';
import DeleteUserButton from './DeleteUserButton';

export const UserTableColumns = [
  {
    header: 'Name',
    accessorKey: 'first_name',
    hideColumn: null,
    className: 'font-medium !py-4',
    cell: ({ row }) => <BuildStack original={row.original} />,
  },
  {
    header: 'Email',
    accessorKey: 'email',
    hideColumn: 480,
    className: '!py-4',
  },
  {
    header: 'Phone',
    accessorKey: 'phone',
    hideColumn: 640,
    className: '!py-4',
    cell: ({ getValue }) => formatPhoneNumber(normalizePhone(getValue())),
  },
  {
    header: 'Role',
    accessorKey: 'role',
    hideColumn: 1024,
    className: '!py-4',
    cell: ({ getValue }) => {
      return (
        <div
          className={classNames({
            'text-success font-medium': getValue() === 'borrower',
          })}
        >
          {getValue() === 'borrower' ? 'Primary Owner' : 'Purchaser'}
        </div>
      );
    },
  },
  {
    header: '',
    accessorKey: 'id',
    hideColumn: 1024,
    className: '!py-0',
    cell: ({ row }) => {
      if (row.original.role === 'borrower') return null;
      return <DeleteUserButton user={row.original} />;
    },
  },
];
