import React from 'react';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons';
import classNames from 'classnames';

import Notification from '@components/Notification';
import { formatCurrency } from '@lib/utils/formatters';

export default function Stats({ entity, stats, errors, isLoading }) {
  const remainingCredit = entity?.credit_line.amount - stats?.credit_utilized;
  let approvedUser = entity?.underwriting_status === 'approved';

  const entityData = [
    {
      name: 'Maximum Credit',
      value: !approvedUser ? '--' : formatCurrency(entity?.credit_line.amount),
      className: 'text-primary-blue-hover',
    },
    {
      name: 'Credit in Use',
      value: !approvedUser ? '--' : formatCurrency(stats?.credit_utilized),
      className: 'text-tertiary-gray',
    },
    {
      name: 'Remaining Credit',
      value: !approvedUser ? '--' : formatCurrency(remainingCredit),
      className: 'text-success',
    },
    {
      name: 'Active Orders',
      value: stats?.active,
      className: '',
    },
  ];

  if (!isLoading && (!stats || errors?.statsError))
    return (
      <Notification
        icon={faExclamationTriangle}
        textColor="text-error"
        bgColor="bg-error/20"
        headline="An Error Occurred"
        message={`Unable to collect available ${entity?.type} credit and order data. Please contact Credit Key Support for assistance.`}
      />
    );

  return (
    <dl className="mx-auto grid grid-cols-1 gap-px bg-gray-900/5 sm:grid-cols-2 lg:grid-cols-4">
      {entityData.map((stat, idx) => {
        return (
          <div
            key={stat.name}
            className={classNames(
              'flex flex-wrap items-baseline justify-between md:gap-x-4 md:gap-y-2 bg-white pt-4 pb-2 md:pb-3',
              idx === 0 ? 'px-4' : 'px-4 md:px-6'
            )}
          >
            <dt className="text-sm leading-3 text-tertiary-gray">
              {stat.name}
            </dt>
            <dd
              className={classNames(
                'w-full flex-none text-2xl md:text-3xl font-semibold leading-10 tracking-tight text-gray-900',
                stat.className
              )}
            >
              {stat.value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
