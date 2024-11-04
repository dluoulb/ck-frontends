import React from 'react';
import { faCircleQuestion } from '@fortawesome/pro-regular-svg-icons';
import { faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { supportLink } from '@lib/constants/SiteVariables';

export default function SupportWidget() {
  return (
    <div className="px-3 p-2" role={SupportWidget.role}>
      <div className="flex items-center gap-2.5 border-b border-primary-blue-hover/30 pb-3">
        <FontAwesomeIcon
          icon={faCircleQuestion}
          className="text-primary-blue text-base lg:text-xl"
        />

        <p className="text-lg md:text-xl font-bold">Need Support?</p>
      </div>
      <div className="text-sm md:text-base my-3 md:my-6 space-y-4">
        <div className="flex flex-col md:flex-row md:gap-1">
          <p>Monday - Friday:</p>
          <strong>9AM - 1PM & 2PM - 6PM CST</strong>
        </div>
        <div>
          <p>
            Reach us at:
            <a
              href="mailto: support@creditkey.com"
              className="ml-1 hover:text-blue-900 hover:border-b hover:border-primary-blue-hover font-medium text-primary-blue-hover"
            >
              support@creditkey.com
            </a>
          </p>
        </div>
      </div>
      <a
        href={supportLink}
        target="_blank"
        className="flex items-center gap-1 font-medium group text-xs md:text-sm max-w-max"
      >
        <span className="group-hover:text-primary-blue-hover border-b border-transparent group-hover:border-primary-blue-hover">
          Check out our Help Center for common questions
        </span>
        <FontAwesomeIcon
          icon={faChevronRight}
          className="text-[0.6rem] pt-0.5 font-bold group-hover:text-primary-blue-hover"
        />
      </a>
    </div>
  );
}

SupportWidget.role = 'support-widget';
