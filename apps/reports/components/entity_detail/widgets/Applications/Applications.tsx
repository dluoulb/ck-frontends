import React from 'react';
import { faFileLines } from '@fortawesome/pro-regular-svg-icons';
import { faSquare } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Tooltip from '@components/Tooltip';
import useDropdown from '@hooks/useDropdown';
import { fromISO } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';
import {
  AddressDetails,
  ApplicationDropdown,
  ApplicationStatus,
  findApp,
  listOptions,
  PendReasons,
} from '.';

export default function Applications({ props }) {
  const {
    type,
    applications,
    errors: { applicationsError },
  } = props;
  const defaultContentId = applications && applications[0]?.id;
  const { contentItems, setContent } = useDropdown(defaultContentId);

  const getApprovedAmount = (app) => {
    if (type === 'account' && app?.modelshop_decision) {
      return formatCurrency(JSON.parse(app?.modelshop_decision).max_loan);
    } else if (app?.approved_credit_limit !== null) {
      return formatCurrency(app?.approved_credit_limit);
    } else {
      return 'N/A';
    }
  };

  if (applicationsError)
    return (
      <div className="capitalize">
        <div className="flex items-center gap-2 border-b border-primary-gray-border pb-2">
          <span className="fa-layers fa-fw text-4xl lg:text-5xl hidden sm:inline">
            <FontAwesomeIcon icon={faSquare} className="text-secondary-blue" />
            <FontAwesomeIcon
              icon={faFileLines}
              className="text-primary-blue text-base lg:text-xl"
            />
          </span>

          <p className="font-bold tracking-wide text-primary-blue-hover md:text-lg lg:text-xl">
            Applications
          </p>
        </div>
        <p className="text-error my-2 px-4">
          An Error Occured. Please contact Credit Key support.
        </p>
      </div>
    );

  return (
    <div>
      <div className="flex flex-col xl:flex-row xl:items-center justify-between border-b border-primary-gray-border sm:pb-2">
        <div className="flex items-center gap-2">
          <span className="fa-layers fa-fw text-4xl lg:text-5xl hidden sm:inline">
            <FontAwesomeIcon icon={faSquare} className="text-secondary-blue" />
            <FontAwesomeIcon
              icon={faFileLines}
              className="text-primary-blue text-base lg:text-xl"
            />
          </span>

          <p className="font-bold tracking-wide text-primary-blue-hover px-2 md:px-0 md:text-lg lg:text-xl mb-2 sm:mb-0">
            Applications
          </p>
        </div>
        <ApplicationDropdown
          listOptions={listOptions(applications)}
          contentItems={contentItems}
          setContent={setContent}
        />
      </div>
      <section>
        {findApp(contentItems, applications)?.map((app) => {
          return (
            <div
              key={app?.id}
              className="capitalize font-semibold text-sm md:text-base text-primary tracking-wide my-2 px-2 md:px-4"
            >
              <ApplicationStatus app={app} />
              <p>
                <span className="mr-1 font-normal">
                  Approved Credit Amount:
                </span>
                {getApprovedAmount(app)}
              </p>
              <p>
                <span className="mr-1 font-normal">Tier:</span>
                {app?.tier?.includes('_') ? app?.tier?.slice(5) : app.tier}
              </p>
              {type === 'company' && (
                <>
                  <p>
                    <span className="mr-1 font-normal">Company Name:</span>
                    {app?.company_name}
                  </p>
                  <p>
                    <span className="mr-1 font-normal">GAR:</span>
                    {formatCurrency(app?.gross_annual_revenue)}
                  </p>
                  <p>
                    <span className="mr-1 font-normal">EIN:</span>
                    {app?.ein}
                  </p>
                </>
              )}
              <p>
                <span className="mr-1 font-normal">Submission Date:</span>
                {app?.original_submission_date
                  ? fromISO(app?.original_submission_date).toLocaleString()
                  : 'N/A'}
              </p>
              <p>
                <span className="mr-1 font-normal">
                  Application Decision Date:
                </span>
                {fromISO(app?.latest_submission_date).toLocaleString()}
              </p>
              <p>
                <span className="mr-1 font-normal">Pended:</span>
                {app?.pended_at
                  ? fromISO(app?.pended_at).toLocaleString()
                  : 'No'}
              </p>
              <PendReasons app={app} />
              <p>
                <span className="mr-1 font-normal">Last Submission Date:</span>
                {app?.latest_submission_date
                  ? fromISO(app?.latest_submission_date).toLocaleString()
                  : 'N/A'}
              </p>
              <div>
                <span className="mr-1 font-normal">Birth Date:</span>
                {app?.birthdate ? (
                  fromISO(app?.birthdate).toLocaleString()
                ) : (
                  <Tooltip
                    tooltip_text="NetX applicants do not provide birthdate during application flow"
                    trigger_class="cursor-pointer"
                    container_class="text-center p-4 px-6 text-sm max-w-sm bg-secondary-blue font-normal normal-case"
                  >
                    N/A - NetX Applicant
                  </Tooltip>
                )}
              </div>
              <p>
                <span className="mr-1 font-normal">Equifax Request Date:</span>
                {fromISO(app?.equifax_request_date).toLocaleString()}
              </p>
              <p>
                <span className="mr-1 font-normal">Equifax FICO Score:</span>
                {app?.fico_score}
              </p>
              <p>
                <span className="mr-1 font-normal">IP Address:</span>
                {app?.applicant_ip_address}
              </p>
              <p>
                <span className="mr-1 font-normal">Application Channel:</span>
                {app?.applied_with_merchant || 'Direct'}
              </p>
              <p>
                <span className="mr-1 font-normal">Application ID:</span>
                {app?.id}
              </p>
              {type === 'company' && (
                <AddressDetails
                  type="business"
                  tooltip={false}
                  appAddress={app?.business_address}
                />
              )}
              <AddressDetails
                type="personal"
                tooltip={app?.tier === 'NETX'}
                tooltip_text={
                  app?.tier === 'NETX'
                    ? 'NetX Applicants do not provide personal address during application flow'
                    : ''
                }
                appAddress={app?.personal_address}
              />
            </div>
          );
        })}
      </section>
    </div>
  );
}
