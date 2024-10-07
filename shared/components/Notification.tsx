import React, { FC } from 'react';
import { faArrowRightLong } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import ZendeskChatLink from './ZendeskChatLink';

interface NotificationProps {
  icon?: any;
  textColor: string;
  bgColor: string;
  headline?: string;
  message: any;
  ctaButton?: any;
  isWidget?: boolean;
}

const Notification: FC<NotificationProps> = ({
  icon,
  textColor,
  bgColor,
  headline,
  message,
  ctaButton,
  isWidget,
}) => {
  return (
    <div
      className={classNames('rounded-md py-4 px-6 w-full', bgColor, textColor)}
    >
      <div className="flex gap-3">
        <FontAwesomeIcon icon={icon} className="hidden sm:inline text-xl mt-1.5" />
        <div className="flex flex-col gap-4 w-full">
          <div
            className={classNames('flex flex-col gap-1', {
              'md:min-h-40 md:max-h-40': isWidget,
            })}
          >
            <h3 className="font-bold text-xl">{headline}</h3>
            <p className="text-sm">{message}</p>
          </div>
          <div className="flex items-center gap-2 cursor-pointer hover:text-icon-error border-b border-transparent hover:border-icon-error max-w-max">
            {ctaButton ? (
              ctaButton
            ) : (
              <>
                <ZendeskChatLink
                  msg="Contact Credit Key Support"
                  className="text-sm font-medium"
                />
                <FontAwesomeIcon icon={faArrowRightLong} className="mt-0.5" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Notification;
