import React, { useState } from 'react';
import {
  faBuilding,
  faCircleInfo,
  faUser,
  faUsers,
} from '@fortawesome/pro-regular-svg-icons';
import { faSquare } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { DateTime } from 'luxon';

import Loading from '@components/Loading';
import { useBorrowerDeps } from '@contexts';
import { reformatDate } from '@lib/utils/datetime_formatters';
import BorrowerDetails from './BorrowerDetails';
import Users from './Users';

export default function ProfileIndex() {
  const [content, setContent] = useState('details');
  const { entity, companyUsersLoading } = useBorrowerDeps();

  const tabs = [
    {
      title: `${entity?.type === 'company' ? 'Company' : 'User'} Details`,
      icon: faCircleInfo,
      tag: 'details',
    },
    entity?.type === 'company' && {
      title: 'Users',
      icon: faUsers,
      tag: 'users',
    },
  ];

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
        <div className="relative rounded-md border-t border-x border-primary-gray-border shadow-sm mt-4 md:mt-8 min-h-max">
          <div className="py-8 px-6 border-b border-primary-gray-border">
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
          <div className="border-b border-gray-200 -mb-px flex w-full">
            {tabs.map((tab) => {
              if (!tab) return;
              return (
                <div
                  onClick={() => setContent(tab.tag)}
                  aria-current="page"
                  className={classNames(
                    content === tab.tag
                      ? 'border-primary-blue text-primary-blue bg-secondary-blue font-semibold'
                      : 'border-transparent text-gray-500 hover:border-primary-blue-hover hover:text-primary-blue-hover hover:cursor-pointer hover:bg-primary-blue-hover/20',
                    'group inline-flex items-center justify-center border-b-2 py-4 px-8 text-sm font-medium w-full'
                  )}
                >
                  <FontAwesomeIcon
                    icon={tab.icon}
                    aria-hidden="true"
                    className={classNames(
                      content === tab.tag
                        ? 'text-primary-blue'
                        : 'text-gray-400 group-hover:text-primary-blue-hover',
                      '-ml-0.5 mr-2 h-4 w-4'
                    )}
                  />
                  <span>{tab.title}</span>
                </div>
              );
            })}
          </div>
          {content === 'details' ? <BorrowerDetails /> : <Users />}
        </div>
      </div>
    </div>
  );
}

ProfileIndex.role = 'profile-component';
