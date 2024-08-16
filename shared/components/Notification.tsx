import React from 'react';
import { faArrowRightLong } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import ZendeskChatLink from './ZendeskChatLink';

export default function Notification({
  icon,
  textColor,
  bgColor,
  headline,
  message,
  supportLink,
}) {
  return (
    <div
      className={classNames('rounded-md py-4 px-6 w-full', bgColor, textColor)}
    >
      <div className="flex gap-3">
        <FontAwesomeIcon icon={icon} className="text-xl mt-1.5" />
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-xl">{headline}</h3>
            <p className="text-sm">{message}</p>
          </div>
          {supportLink && (
            <div className="flex items-center gap-2 group cursor-pointer">
              <ZendeskChatLink
                msg="Contact Credit Key Support"
                className="text-sm font-medium group-hover:text-icon-error"
              />
              <FontAwesomeIcon
                icon={faArrowRightLong}
                className="mt-0.5 group-hover:text-icon-error"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
