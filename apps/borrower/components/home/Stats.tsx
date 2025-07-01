import React from 'react';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons';
import classNames from 'classnames';

import Notification from '@components/Notification';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useEntity } from '@contexts/EntityContext';
import { formatCurrency } from '@lib/utils/formatters';

export default function Stats() {
  const { entity } = useEntity();
  const { stats, statsError, isLoading } = useBorrowerDeps();

  const remainingCredit = entity?.credit_line !== undefined ?
    entity.credit_line.remaining_amount :
    entity.max_purchase_amount - stats?.credit_utilized;
  let approvedUser = entity?.status === 'approved';

  const entityData = [
    {
      name: 'Maximum Credit',
      value: !approvedUser ? '--' : formatCurrency(entity.max_purchase_amount),
      className: 'text-primary-blue-hover',
      link: {
        url: 'https://www.creditkey.com/credit-key-increase-request',
        name: 'Request Increase',
      }
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

  if (!isLoading && (!stats || statsError))
    return (
      <Notification
        icon={faExclamationTriangle}
        iconBorderColor="border-error"
        textColor="text-error"
        bgColor="bg-error/20"
        buttonClass='hover:border-error'
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
              {stat.link ? (
                <div className="flex flex-col items-start">
                  <span>{stat.value}</span>
                  <a
                    href={stat.link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-blue no-underline hover:underline mt-1 inline-block"
                  >
                    {stat.link.name}
                  </a>
                </div>
              ) : (
                <div className="flex flex-col items-start">
                  <span>{stat.value}</span>
                  <span className="mt-1 text-xs invisible">placeholder</span>
                </div>
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
