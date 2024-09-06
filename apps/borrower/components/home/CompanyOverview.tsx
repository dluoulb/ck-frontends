import React from 'react';
import { faCircleInfo } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import DefaultTermsDisplay from '@apps/borrower/components/home/widgets/default_settings/DefaultTermsDisplay';
import Tooltip from '@components/Tooltip';
import { formatCurrency } from '@lib/utils/formatters';

export default function CompanyOverview({ company, defaultTerms }) {
  const remainingCredit =
    company.credit_line.remaining_amount < 0
      ? 0
      : company.credit_line.remaining_amount;

  let statusColor = '';
  let approvedUser = company?.underwriting_status === 'approved';

  switch (company?.underwriting_status) {
    case 'pending':
    case 'hold':
      statusColor = 'bg-background-warning text-warning';
      break;
    case 'approved':
      statusColor = 'bg-background-success text-success';
      break;
    case 'declined':
      statusColor = 'bg-background-error text-error';
      break;
    default:
      statusColor = 'bg-background-primary-blue text-primary-blue';
  }

  // this widget is only for Company data
  if (!company) return null;

  return (
    <div>
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between px-6 p-4 md:p-5">
        <div className="font-semibold text-sm md:text-base capitalize w-full flex flex-col sm:flex-row sm:items-center justify-between">
          <p
            data-testid="entity_name"
            className="text-xl sm:text-2xl font-bold"
          >
            {company?.name}
          </p>
          <span
            role="status"
            className={classNames(
              'inline-flex items-center text-sm sm:text-lg rounded-md px-3 sm:px-4 py-2 my-2 md:my-0 font-semibold tracking-wide mb-2 sm:mb-0 w-max sm:w-auto',
              statusColor
            )}
          >
            {company?.underwriting_status}
          </span>
        </div>
      </div>
      {/* <!-- Approved credit--> */}
      <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-center justify-between sm:py-3 px-6">
        <div className="flex flex-col gap-1">
          <p className="font-bold text-primary-blue-hover text-2xl">
            {!approvedUser ? '--' : formatCurrency(company.credit_line.amount)}
          </p>
          <p className="text-tertiary-gray text-sm">Maximum Credit</p>
        </div>
        {/* <!-- Credit in Use --> */}
        <div className="flex flex-col gap-1">
          <p className="font-bold text-tertiary-gray text-2xl">
            {!approvedUser
              ? '--'
              : formatCurrency(
                  company.credit_line.amount -
                    company.credit_line.remaining_amount
                )}
          </p>
          <p className="text-tertiary-gray text-sm">Credit in Use</p>
        </div>
        {/* <!-- Remaining credit--> */}
        <div className="flex flex-col gap-1">
          <p className="font-bold text-success text-2xl">
            {!approvedUser ? '--' : formatCurrency(remainingCredit)}
          </p>
          <p className="text-tertiary-gray text-sm">Remaining Credit</p>
        </div>
      </div>
      {/* <!-- Rate --> */}
      <div className="py-3 my-3 border-t border-b border-primary-gray-border">
        <div className="flex justify-between px-6">
          <div className="flex items-center">
            <div className="text-sm flex items-center">
              <span className="mr-1 text-sm">Base Rate</span>
              {company.min_rate !== 'N/A' && approvedUser && (
                <Tooltip
                  tooltip_text={
                    <div>
                      Rate may range from
                      <p className="mx-1 font-bold">
                        {company.min_rate} - {company.max_rate}%
                      </p>
                      based on term length selection
                    </div>
                  }
                  trigger_class="hover:text-primary-blue cursor-pointer"
                  container_class="text-center p-4 px-6 text-sm bg-secondary-blue text-primary-blue-hover"
                >
                  <FontAwesomeIcon icon={faCircleInfo} className="text-xxs" />
                </Tooltip>
              )}
            </div>
          </div>
          <div className="font-semibold text-sm md:text-base">
            {company.min_rate !== 'N/A' && approvedUser
              ? `${company.min_rate}%`
              : '--'}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 pt-1.5 pb-5 px-6">
        <div className="font-semibold text-primary-blue-hover text-base md:text-lg">
          {!defaultTerms?.length ? null : <p>Default Terms</p>}
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {defaultTerms && <DefaultTermsDisplay />}
        </div>
      </div>
    </div>
  );
}
