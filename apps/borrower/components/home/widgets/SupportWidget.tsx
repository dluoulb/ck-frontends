import React from 'react';
import { faArrowRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { supportLink } from '@lib/constants/SiteVariables';

export default function SupportWidget() {
  return (
    <div className="p-6 h-full" role={SupportWidget.role}>
      <div className="flex items-center gap-2.5 border-b border-border-gray pb-2">
        <p className="text-lg md:text-xl font-bold">Need Support?</p>
      </div>
      <div className="flex flex-col justify-center ext-sm md:text-base space-y-1 md:min-h-24 h-full pb-6">
        <div className="flex flex-col md:flex-row md:gap-1">
          <p>Monday - Friday:</p>
          <strong>9AM - 1PM & 2PM - 6PM CST</strong>
        </div>
        <div>
          <p>
            Email:
            <a
              href="mailto:support@creditkey.com"
              className="ml-1 hover:text-blue-900 hover:border-b hover:border-primary-blue-hover font-medium text-primary-blue"
            >
              support@creditkey.com
            </a>
          </p>
        </div>
        <a
          href={supportLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-medium group text-md max-w-max"
        >
          <span className="text-primary-blue group-hover:text-primary-blue-hover border-b border-transparent group-hover:border-primary-blue-hover">
            View our help center for common questions
            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-[0.6rem] pl-1 font-bold text-primary-blue group-hover:text-primary-blue-hover"
            />
          </span>
        </a>
      </div>
    </div>
  );
}

SupportWidget.role = 'support-widget';
