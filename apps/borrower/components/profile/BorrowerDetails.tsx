import React from 'react';
import { faEnvelope, faHeadset } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime } from 'luxon';

import ZendeskChatLink from '@components/ZendeskChatLink';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useEntity } from '@contexts/EntityContext';
import { reformatDate } from '@lib/utils/datetime_formatters';
import {
  formatCurrency,
  formatPhoneNumber,
  normalizePhone,
} from '@lib/utils/formatters';

export default function BorrowerDetails() {
  const { entity } = useEntity();
  const { companyUsers } = useBorrowerDeps();

  const owner =
    entity?.type === 'company'
      ? companyUsers?.find((u) => u.role === 'borrower')
      : entity?.user;

  return (
    <div className="flex flex-col pt-6">
      <div className="border-b border-primary-gray-border px-6 sm:px-8 pb-6">
        <div className="text-sm font-medium flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="text-tertiary-gray">
            <p>View your {entity?.type} details below.</p>
            <p>
              To update your contact information, please reach out to Credit Key
              Support.
            </p>
          </div>
          <div className="mt-4 lg:mt-0 font-semibold flex flex-col xs:flex-row lg:flex-col justify-between items-start xs:items-end gap-1">
            <a
              href="mailto: support@creditkey.com"
              className="flex items-center gap-1.5"
            >
              <FontAwesomeIcon icon={faEnvelope} />
              <p className="text-primary-blue-hover hover:underline">
                Email Credit Key
              </p>
            </a>
            <div className="capitalize flex items-center gap-1.5">
              <FontAwesomeIcon icon={faHeadset} />
              <ZendeskChatLink className="text-primary-blue-hover hover:underline" />
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 sm:p-8 divide-y overflow-x-scroll">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-0 pb-8">
          <div className="sm:w-2/5">
            <p className="capitalize font-bold text-lg sm:text-base">Contact Information</p>
            <p className="text-tertiary-gray text-sm font-medium w-3/4">
              Primary account owner details used for orders and applications.
            </p>
          </div>
          <div className="sm:w-3/5 font-semibold border-t border-primary-border-gray sm:border-transparent pt-4 sm:pt-0">
            <p>
              <span className="mr-1 font-medium text-tertiary-gray text-sm">
                Owner:
              </span>
              {owner?.first_name} {owner?.last_name}
            </p>
            <p>
              <span className="mr-1 font-medium text-tertiary-gray text-sm">
                Phone Number:
              </span>
              {formatPhoneNumber(normalizePhone(owner?.phone))}
            </p>
            <p>
              <span className="mr-1 font-medium text-tertiary-gray text-sm">
                Email:
              </span>
              {owner?.email}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-0 pt-8">
          <div className="sm:w-2/5">
            <p className="capitalize font-bold text-lg sm:text-base">Underwriting Data</p>
            {entity?.type === 'company' ? (
              <p className="text-tertiary-gray text-sm font-medium w-3/4">
                Latest application data used for credit line decisioning and
                approved products.
              </p>
            ) : (
              <p className="text-tertiary-gray text-sm font-medium w-3/4">
                Latest application decision data for user spending limit.
              </p>
            )}
          </div>
          {entity?.type === 'company' ? (
            <div className="sm:w-3/5 font-semibold border-t border-primary-border-gray sm:border-transparent pt-4 sm:pt-0">
              <p>
                <span className="mr-1 font-medium text-tertiary-gray text-sm">
                  EIN:
                </span>
                {entity?.ein}
              </p>
              <div>
                <span className="mr-1 font-medium text-tertiary-gray text-sm">
                  Business Address:
                </span>
                {entity?.address?.address1 ? (
                  <div className="inline-flex gap-1">
                    <p>{entity?.address.address1}</p>
                    <p>{entity?.address.address2}</p>
                    <p>
                      {entity?.address.city}, {entity?.address?.state}{' '}
                      {entity?.address.zip.slice(0, 5)}
                    </p>
                  </div>
                ) : (
                  'Not Provided'
                )}
              </div>
              <p>
                <span className="mr-1 font-medium text-tertiary-gray text-sm">
                  Decision Date:
                </span>
                {entity?.latest_approval_date
                  ? reformatDate(
                      entity?.latest_approval_date,
                      false,
                      DateTime.DATE_FULL
                    )
                  : reformatDate(
                      entity?.first_decision_date,
                      false,
                      DateTime.DATE_FULL
                    )}
              </p>
              <p>
                <span className="mr-1 font-medium text-tertiary-gray text-sm">
                  Gross Annual Revenue:
                </span>
                {formatCurrency(entity?.gross_annual_revenue)}
              </p>
              <p className="capitalize">
                <span className="mr-1 font-medium text-tertiary-gray text-sm">
                  Underwriting Status:
                </span>
                {entity?.underwriting_status}
              </p>
            </div>
          ) : (
            <div className="w-3/5 font-semibold">
              <p>
                <span className="mr-1 font-medium text-tertiary-gray text-sm">
                  Tier:
                </span>
                {entity?.tier}
              </p>
              <p>
                <span className="mr-1 font-medium text-tertiary-gray text-sm">
                  Tier Limit:
                </span>
                {entity?.tier_limit}
              </p>
              <p>
                <span className="mr-1 font-medium text-tertiary-gray text-sm">
                  Decision Date:
                </span>
                {reformatDate(entity?.created_at, false, DateTime.DATE_FULL)}
              </p>
              <p className="capitalize">
                <span className="mr-1 font-medium text-tertiary-gray text-sm">
                  Status:
                </span>
                {entity?.status}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
