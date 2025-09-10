import React, { FC } from 'react';
import classNames from 'classnames';

import {
  declinedSupportPhone,
  supportPhone,
} from '@lib/constants/SiteVariables';

interface SupportProps {
  asText?: boolean;
  declined?: string;
  containerClass?: string;
}

const Support: FC<SupportProps> = ({ asText, declined, containerClass }) => {
  return (
    <div
      className={classNames(
        'mb-2 sm:my-2 text-sm modal:text-base',
        containerClass,
        {
          'p-3 px-4 sm:p-6 border border-tertiary-gray rounded-lg': !asText,
        }
      )}
    >
      <div
        className={classNames(
          'text-sm sm:text-base modal:text-xl mb-2',
          asText ? 'font-semibold' : 'font-extrabold'
        )}
      >
        Any questions or issues?
      </div>
      Contact Credit Key Support at
      <div>
        <a
          href="mailto:support@creditkey.com"
          className="mx-1 text-primary-blue hover:text-primary-blue-hover"
        >
          support@creditkey.com
        </a>
        or{' '}
        <span className="text-primary-blue">
          {declined ? declinedSupportPhone : supportPhone}
        </span>
      </div>
    </div>
  );
};

export default Support;
