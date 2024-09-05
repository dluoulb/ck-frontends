import React from 'react';
import classNames from 'classnames';

import { formatPhoneNumber, normalizePhone } from '@lib/utils/formatters';
import { BuildStack } from './BuildColumnStack';
import DeleteUserButton from './DeleteUserButton';

export const UserTableColumns = [
  {
    Header: 'Name',
    accessor: 'first_name',
    hideColumn: null,
    className: 'font-medium',
    Cell: ({ row: { original } }) => <BuildStack original={original} />,
  },
  {
    Header: 'Email',
    accessor: 'email',
    hideColumn: 480,
  },
  {
    Header: 'Phone',
    accessor: 'phone',
    hideColumn: 640,
    Cell: ({ value }) => formatPhoneNumber(normalizePhone(value)),
  },
  {
    Header: 'Role',
    accessor: 'role',
    hideColumn: 1024,
    Cell: ({ value }) => {
      return (
        <div
          className={classNames({
            'text-success font-medium': value === 'borrower',
          })}
        >
          {value === 'borrower' ? 'Primary Owner' : 'Purchaser'}
        </div>
      );
    },
  },
  {
    Header: '',
    accessor: 'id',
    hideColumn: 1024,
    className: 'text-error',
    Cell: ({ row: { original } }) => {
      if (original.role === 'borrower') return null;
      return <DeleteUserButton user={original} />;
    },
  },
];
