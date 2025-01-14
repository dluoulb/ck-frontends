import React from 'react';
import { faEnvelope, faPhone } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime } from 'luxon';

import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useEntity } from '@contexts/EntityContext';
import { supportPhone } from '@lib/constants/SiteVariables';
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
      <div className="px-6 sm:px-8 pb-6 divide-y overflow-x-scroll">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-0 pb-8">
          <div className="sm:w-2/5">
            <p className="capitalize font-bold text-lg sm:text-base">
              Account Owner
            </p>
            <p className="text-tertiary-gray text-sm font-medium w-3/4">
              Primary account owner details.
            </p>
          </div>
          <div className="sm:w-3/5 font-semibold border-t border-primary-border-gray sm:border-transparent pt-4 sm:pt-0">
            <table>
              <tbody>
                <tr>
                  <td>
                    <span className="mr-1 font-medium text-tertiary-gray text-sm">
                      Name:
                    </span>
                  </td>
                  <td className="pl-4">
                    {owner?.first_name} {owner?.last_name}
                  </td>
                </tr>
                <tr>
                  <td className="pt-2">
                    <span className="mr-1 font-medium text-tertiary-gray text-sm">
                      Mobile Phone:
                    </span>
                  </td>
                  <td className="pt-2 pl-4">
                    {formatPhoneNumber(normalizePhone(owner?.phone))}
                  </td>
                </tr>
                <tr>
                  <td className="pt-2">
                    <span className="mr-1 font-medium text-tertiary-gray text-sm">
                      Email:
                    </span>
                  </td>
                  <td className="pt-2 pl-4">
                    {owner?.email}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-0 pt-8">
          <div className="sm:w-2/5">
            <p className="capitalize font-bold text-lg sm:text-base">
              Business Details
            </p>
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
              <table>
                <tbody>
                  <tr className="align-top">
                    <td>
                      <p className="mr-1 font-medium text-tertiary-gray text-sm">
                        Address:
                      </p>
                    </td>
                    <td className="pl-4">
                      <div>
                        {entity?.address?.address1 ? (
                          <div>
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
                    </td>
                  </tr>
                  <tr>
                    <td className="pt-2">
                      <span className="mr-1 font-medium text-tertiary-gray text-sm">
                        Business Phone:
                      </span>
                    </td>
                    <td className="pl-4 pt-2">
                      {entity?.phone ? (
                        formatPhoneNumber(normalizePhone(entity?.phone))
                      ) : (
                        'Not Provided'
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="pt-2">
                      <span className="mr-1 font-medium text-tertiary-gray text-sm">
                        EIN:
                      </span>
                    </td>
                    <td className="pl-4 pt-2">
                      {entity?.ein}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="w-3/5 font-semibold">
              <p>
                <span className="mr-1 font-medium text-tertiary-gray text-sm">
                  Credit Limit:
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
      <div className="border-b border-primary-gray-border p-6 sm:p-8">
        <div className="text-sm font-medium flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="text-tertiary-gray">
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
              <FontAwesomeIcon icon={faPhone} />
              <a
                href={`tel:${supportPhone}`}
                className="ml-2 no-underline text-primary-blue cursor-pointer"
              >
                Call Credit Key
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
