import React from 'react';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { fromISO } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';

export default function BorrowerInfo({ order, entity }) {
  return (
    <div className="flex items-start gap-2" role={BorrowerInfo.role}>
      <span className="fa-layers fa-fw text-4xl md:text-5xl hidden sm:inline">
        <FontAwesomeIcon icon={faCircle} className="text-secondary-blue" />
        <FontAwesomeIcon icon={faUser} className="text-primary-blue text-base md:text-xl" />
      </span>
      <div className="text-sm text-primary font-medium tracking-wide capitalize">
        <p className="font-semibold text-lg mb-1">Borrower Details</p>
        <p>
          <span className="text-tertiary-gray mr-2 font-normal">Name:</span>
          {entity?.name}
        </p>
        {order?.entity_type === 'company' && (
          <p>
            <span className="text-tertiary-gray mr-2 font-normal">company GAR:</span>
            {formatCurrency(entity?.gross_annual_revenue)}
          </p>
        )}
        <p>
          <span className="text-tertiary-gray mr-2 font-normal">applicant fico:</span>
          {entity?.applicant_fico_score}
        </p>
        <p>
          <span className="text-tertiary-gray mr-2 font-normal">credit tier:</span>
          {entity?.tier.includes('_') ? entity?.tier.replace('_', ' ') : entity?.tier}
        </p>
        {order?.entity_type === 'company' && (
          <p>
            <span className="text-tertiary-gray mr-2 font-normal">credit line approval date:</span>
            {entity?.latest_approval_date
              ? fromISO(entity?.latest_approval_date).toLocaleString()
              : 'N/A'}
          </p>
        )}
      </div>
    </div>
  );
}

BorrowerInfo.role = 'borrower-info-component';
