import React from 'react';
import Loading from '@components/Loading';
import classNames from 'classnames';
import { formatCurrency } from 'lib/utils/formatters';

export default function EntityOverview({ props }) {
  let statusColor;
  const { type, entity, stats, errors } = props;
  const status =
    type === 'company' ? entity?.underwriting_status : entity?.status;

  switch (status) {
    case 'approved':
      statusColor = 'bg-background-success text-success';
      break;
    case 'declined':
      statusColor = 'bg-background-error text-error';
      break;
    case 'hold':
    case 'pending':
      statusColor = 'bg-background-warning text-warning';
      break;
    default:
      statusColor = 'bg-secondary-blue text-primary-blue';
      break;
  }

  const getDisplay = () => {
    if (!stats && !errors.statsError) {
      return <Loading className="w-7 h-7" />;
    } else if (errors.statsError) {
      return;
    } else {
      return (
        <div className='text-sm md:text-base'>
          <p>
            <span className="mr-1 font-normal">Credit Utilized:</span>
            {formatCurrency(stats?.credit_utilized)}
          </p>
          <p>
            <span className="mr-1 font-normal">Active Orders:</span>
            {stats?.active}
          </p>
          <p>
            <span className="mr-1 font-normal">Closed Orders:</span>
            {stats?.closed}
          </p>
        </div>
      );
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="w-full flex flex-col sm:flex-row justify-between capitalize">
          <div className='text-sm md:text-base'>
            <p className="text-xl md:text-3xl font-bold text-primary-blue-hover">
              {entity?.name}
            </p>
            <p className="font-semibold">
              <span className="mr-1 font-normal">Tier:</span>
              {entity?.tier.includes('_')
                ? entity?.tier.replace('_', ' ')
                : entity?.tier}
            </p>
            <p className="font-semibold">
              <span className="mr-1 font-normal">TCL:</span>
              {formatCurrency(
                type === 'company'
                  ? entity?.approved_credit_limit
                  : entity?.tier_limit
              )}
            </p>
          </div>
          <div className="flex flex-col-reverse sm:flex-col sm:items-end gap-1 sm:gap-2">
            <span
              className={classNames(
                'inline-flex items-center text-sm sm:text-lg rounded-md px-3 sm:px-4 py-2 font-semibold tracking-wide mb-2 sm:mb-0 w-max sm:w-auto',
                statusColor
              )}
            >
              {status}
            </span>
            <div className="font-semibold sm:text-right">{getDisplay()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
