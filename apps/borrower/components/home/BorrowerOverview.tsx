import React from 'react';
import { faCircleInfo } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import Loading from '@components/Loading';
import Tooltip from '@components/Tooltip';
import { useEntity } from '@contexts/EntityContext';

export default function BorrowerOverview() {
  const { entity, entityLoading } = useEntity();

  let statusColor;
  const approvedUser = entity?.status === 'approved';

  switch (entity?.status) {
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
    <div className="pt-6">
      <div className="flex justify-between items-center">
        {entityLoading ? (
          <Loading className="w-14 h-14 my-36" />
        ) : (
          <div className="w-full flex flex-col sm:flex-row justify-between capitalize">
            <div className="text-sm md:text-base">
              <p
                data-testid="entity_name"
                className="text-2xl md:text-3xl font-bold text-primary-blue-hover"
              >
                {entity?.name}
              </p>
              {entity?.type === 'company' && (
                <p className="font-semibold">
                  Base Rate:
                  <span className="mx-1">
                    {entity?.min_rate !== 'N/A' && approvedUser ? `${entity?.min_rate}%` : '--'}
                  </span>
                  {entity?.min_rate !== 'N/A' && approvedUser && (
                    <Tooltip
                      tooltip_text={
                        entity?.tier === 'NETX' ? (
                          <p>Net 30 terms do not incur an interest fee.</p>
                        ) : (
                          <p>
                            Rate may range from
                            <span className="mx-1 font-bold">
                              {entity?.min_rate} - {entity?.max_rate}%
                            </span>
                            based on term length selection
                          </p>
                        )
                      }
                      trigger_class="hover:text-primary-blue cursor-pointer text-tertiary-gray !border-none"
                      container_class="text-center p-4 px-6 text-sm bg-secondary-blue"
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
                  'inline-flex items-center text-sm sm:text-md rounded-md px-3 sm:px-4 py-2 font-semibold tracking-wide mb-2 sm:mb-0 w-max sm:w-auto',
                  statusColor,
                )}
              >
                {entity?.status}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
