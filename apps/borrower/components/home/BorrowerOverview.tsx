import React from 'react';
import { faCircleInfo } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import Tooltip from '@components/Tooltip';

export default function BorrowerOverview({ entity, type }) {
  let statusColor;
  const status =
    type === 'company' ? entity?.underwriting_status : entity?.status;
  const approvedUser =
    type === 'company'
      ? entity?.underwriting_status === 'approved'
      : entity?.status === 'approved';

  switch (status) {
    case 'pending':
    case 'hold':
      statusColor = 'bg-background-warning text-warning';
      break;
    case 'approved':
      statusColor = 'bg-background-success text-success';
      break;
    case 'declined':
    case 'canceled':
      statusColor = 'bg-background-error text-error';
      break;
    default:
      statusColor = 'bg-secondary-blue text-primary-blue';
  }
  return (
    <div className="px-6 pt-6">
      <div className="flex justify-between items-center">
        <div className="w-full flex flex-col sm:flex-row justify-between capitalize">
          <div className="text-sm md:text-base">
            <p
              data-testid="entity_name"
              className="text-2xl md:text-3xl font-bold text-primary-blue-hover"
            >
              {entity?.name}
            </p>
            <p className="font-semibold">
              <span className="mr-1 font-normal">Tier:</span>
              {entity?.tier.includes('_')
                ? entity?.tier.replace('_', ' ')
                : entity?.tier}
            </p>
            {type === 'company' && (
              <p>
                Base Rate:
                <span className="mx-1 font-semibold">
                  {entity?.min_rate !== 'N/A' && approvedUser
                    ? `${entity?.min_rate}%`
                    : '--'}
                </span>
                {entity?.min_rate !== 'N/A' && approvedUser && (
                  <Tooltip
                    tooltip_text={
                      <div>
                        Rate may range from
                        <p className="mx-1 font-bold">
                          {entity?.min_rate} - {entity?.max_rate}%
                        </p>
                        based on term length selection
                      </div>
                    }
                    trigger_class="hover:text-primary-blue cursor-pointer text-xs text-tertiary-gray"
                    container_class="font-normal text-center p-4 px-6 text-sm bg-secondary-blue text-primary-blue-hover"
                  >
                    <FontAwesomeIcon icon={faCircleInfo} />
                  </Tooltip>
                )}
              </p>
            )}
          </div>
          <div className="flex flex-col-reverse sm:flex-col sm:items-end gap-1 sm:gap-2 mt-4 md:mt-0">
            <span
              role="status"
              className={classNames(
                'inline-flex items-center text-sm sm:text-lg rounded-md px-3 sm:px-4 py-2 font-semibold tracking-wide mb-2 sm:mb-0 w-max sm:w-auto',
                statusColor
              )}
            >
              {status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
