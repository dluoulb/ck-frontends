import React from 'react';
import { faBuilding } from '@fortawesome/pro-regular-svg-icons';
import { faSquare } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useReportsDeps } from '@contexts/ReportsContext';
import { fromISO } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';
import { AddressDetails } from './Applications';

export default function EntityInfo() {
  const { entity } = useReportsDeps();

  return (
    <div className="capitalize">
      <div className="flex items-center gap-2 border-b border-primary-gray-border pb-2">
        <span className="fa-layers fa-fw text-4xl lg:text-5xl hidden sm:inline">
          <FontAwesomeIcon icon={faSquare} className="text-secondary-blue" />
          <FontAwesomeIcon
            icon={faBuilding}
            className="text-primary-blue text-base lg:text-xl"
          />
        </span>

        <p className="font-bold tracking-wide text-primary-blue-hover px-2 md:px-0 md:text-lg lg:text-xl">
          {entity?.type} Details
        </p>
      </div>
      <div className="text-sm md:text-base text-primary font-medium tracking-wide my-2 px-2 md:px-4">
        <div className="font-semibold">
          <p>
            <span className="mr-1 font-normal">Created:</span>
            {fromISO(entity?.created_at).toLocaleString()}
          </p>
          <p>
            <span className="mr-1 font-normal">Last Modified Date:</span>
            {fromISO(entity?.updated_at).toLocaleString()}
          </p>
          {entity?.type === 'company' && (
            <>
              <p>
                <span className="mr-1 font-normal">
                  Next Credit Refresh Date:
                </span>
                {entity?.next_credit_refresh_on
                  ? fromISO(entity?.next_credit_refresh_on).toLocaleString()
                  : 'N/A'}
              </p>
              <p>
                <span className="mr-1 font-normal">EIN:</span>
                {entity?.ein}
              </p>
              <p>
                <span className="mr-1 font-normal">Gross Annual Revenue:</span>
                {formatCurrency(entity?.gross_annual_revenue)}
              </p>
              <p>
                <span className="mr-1 font-normal">
                  Number of Beneficial Owners:
                </span>
                {entity?.owner_count}
              </p>
              <p>
                <span className="mr-1 font-normal">Company OFAC Status:</span>
                {entity?.ofac_status}
              </p>
              <AddressDetails type="company" appAddress={entity?.address} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
