import React from 'react';
import Tooltip from '@components/Tooltip';
import { faUser } from '@fortawesome/pro-regular-svg-icons';
import { faSquare } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fromISO } from 'lib/utils/datetime_formatters';

import { AddressDetails } from './Applications';

export default function OwnerInfo({ props }) {
  const { entity, type, ownerAddress, applications } = props;
  const application = applications && applications[0]?.attributes;

  const Birthdate = () => {
    if (type === 'account') return;

    if (entity?.borrower.birthdate) {
      return <p>DOB: {fromISO(entity?.borrower.birthdate).toLocaleString()}</p>;
    } else {
      return (
        <div>
          DOB:
          <Tooltip
            tooltip_text="NetX owners do not provide date of birth during application flow"
            trigger_class="cursor-pointer ml-1.5 font-avenir-book"
            container_class="z-50 text-center p-4 px-6 text-sm max-w-xs font-avenir-book"
          >
            N/A - NetX Applicant
          </Tooltip>
        </div>
      );
    }
  };

  return (
    <div className="capitalize">
      <div className="flex items-center gap-2 border-b border-primary-gray-border pb-2">
        <span className="fa-layers fa-fw text-4xl lg:text-5xl hidden sm:inline">
          <FontAwesomeIcon icon={faSquare} className="text-secondary-blue" />
          <FontAwesomeIcon
            icon={faUser}
            className="text-primary-blue text-base lg:text-xl"
          />
        </span>

        <p className="font-bold tracking-wide text-primary-blue-hover px-2 md:px-0 md:text-lg lg:text-xl">
          Owner Details
        </p>
      </div>
      <div className="text-sm md:text-base text-primary font-medium tracking-wide my-2 px-2 md:px-4">
        <div className="font-semibold">
          {type === 'company' ? (
            <>
              <p>
                <span className="mr-1 font-normal">First Name:</span>
                {entity?.borrower.first_name}
              </p>
              <p>
                <span className="mr-1 font-normal">Last Name:</span>
                {entity?.borrower.last_name}
              </p>
            </>
          ) : (
            <p>
              <span className="mr-1 font-normal">Name:</span>
              {entity?.name}
            </p>
          )}
          <Birthdate />
          <p>
            <span className="mr-1 font-normal">Owner OFAC Status:</span>
            {application?.ofac_status}
          </p>
          <p>
            <span className="mr-1 font-normal">FICO:</span>
            {entity?.applicant_fico_score}
          </p>
          <p>
            <span className="mr-1 font-normal">FICO Score Date:</span>
            {entity?.fico_score_date
              ? fromISO(entity?.fico_score_date).toLocaleString()
              : null}
          </p>
          <AddressDetails
            type="owner"
            tooltip={application?.tier === 'NETX'}
            tooltip_text={
              application?.tier === 'NETX'
                ? 'NetX Applicants do not provide personal address during application flow'
                : ''
            }
            appAddress={ownerAddress}
          />
        </div>
      </div>
    </div>
  );
}
