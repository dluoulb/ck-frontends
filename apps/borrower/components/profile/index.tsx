import React from 'react';
import { faBuilding, faUser } from '@fortawesome/pro-regular-svg-icons';
import { faSquare } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateTime } from 'luxon';

import Loading from '@components/Loading';
import { useBorrowerDeps } from '@contexts';
import { reformatDate } from '@lib/utils/datetime_formatters';
import BorrowerDetails from './BorrowerDetails';
import Users from './Users';

export default function ProfileIndex() {
  const { entity, companyUsersLoading } = useBorrowerDeps();

  if (!entity || companyUsersLoading)
    return <Loading className="w-14 h-14 my-20" />;

  return (
    <div
      data-testid="container"
      className="my-4 md:my-6 mx-auto h-full"
      role={ProfileIndex.role}
    >
      <div className="mx-2 md:max-w-[90%] md:mx-auto h-full">
        <p className="text-2xl md:text-4xl font-bold text-primary capitalize">
          {entity?.type === 'company' ? 'Company' : 'User'} Profile
        </p>
        <div className="relative rounded-md border-t border-x border-primary-border-gray shadow-sm mt-4 md:mt-8 min-h-full">
          <div className="py-8 px-6 border-b border-primary-border-gray">
            <div className="flex items-center gap-2">
              <span className="fa-layers fa-fw text-4xl lg:text-5xl hidden sm:inline">
                <FontAwesomeIcon
                  icon={faSquare}
                  className="text-secondary-blue"
                />
                <FontAwesomeIcon
                  icon={entity?.type === 'company' ? faBuilding : faUser}
                  className="text-primary-blue text-base lg:text-xl"
                />
              </span>
              <div className="flex flex-col">
                <p className="text-2xl font-bold text-primary">
                  {entity?.name}
                </p>
                <p className="text-tertiary-gray font-medium">
                  {entity?.type === 'company' ? 'Borrower' : 'User'} since{' '}
                  {reformatDate(entity.created_at, false, DateTime.DATE_FULL)}
                </p>
              </div>
            </div>
          </div>
          <BorrowerDetails />
          <Users />
        </div>
      </div>
    </div>
  );
}

ProfileIndex.role = 'profile-component';
