import React from 'react';
import {
  faExclamationTriangle,
  faInfoCircle,
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import Notification from '@components/Notification';
import Tooltip from '@components/Tooltip';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useEntity } from '@contexts/EntityContext';
import { formatCurrency } from '@lib/utils/formatters';

export default function Stats() {
  const { entity } = useEntity();
  const { stats, statsError, isLoading } = useBorrowerDeps();

  const remainingCredit =
    entity?.credit_line !== undefined
      ? entity.credit_line.remaining_amount
      : (entity.max_purchase_amount ?? 0) - (stats?.credit_utilized ?? 0);
  let approvedUser = entity?.status === 'approved';

  const entityData = [
    {
      name: 'Maximum Credit',
      value: !approvedUser ? '--' : formatCurrency(entity.max_purchase_amount),
      className: 'text-primary-blue-hover',
      link: {
        url: 'https://www.creditkey.com/credit-key-increase-request',
        name: 'Request Increase',
      },
    },
    {
      name: 'Credit in Use',
      value: !approvedUser ? '--' : formatCurrency(stats?.credit_utilized),
      className: '',
    },
    {
      name: 'Remaining Credit',
      value: !approvedUser ? '--' : formatCurrency(remainingCredit),
      className: '',
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
        buttonClass="hover:border-error"
        headline="An Error Occurred"
        message={`Unable to collect available ${entity?.type} credit and order data. Please contact Credit Key Support for assistance.`}
      />
    );

  return (
    <dl className="mx-auto grid grid-cols-2 gap-px lg:grid-cols-4">
      {entityData.map((stat, idx) => {
        return (
          <div
            key={stat.name}
            className={classNames(
              'flex flex-col md:gap-x-4 md:gap-y-2 bg-white pt-4 pb-2 md:pb-3',
              idx === 0 ? 'px-4' : 'px-4 md:pt-7 md:px-6'
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
                  <div className="flex items-center text-sm">
                    <a
                      href={stat.link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary-blue no-underline hover:underline inline-block"
                    >
                      {stat.link.name}
                    </a>
                    <Tooltip
                      tooltip_text="You are able to request a line increase once every 6 months"
                      trigger_class="cursor-pointer max-w-max border-none"
                      container_class="text-center text-black p-4 px-6 text-sm bg-secondary-blue"
                    >
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        className="text-tertiary-gray ml-2 text-base"
                      />
                    </Tooltip>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start">
                  <span>{stat.value}</span>
                </div>
              )}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
