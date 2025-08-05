import React, { FC } from 'react';
import {
  faArrowRightLong,
  faMegaphone,
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

interface NotificationProps {
  icon?: any;
  iconBorderColor?: any;
  textColor?: string;
  bgColor?: string;
  headline?: string;
  message: any;
  ctaButton?: any;
  buttonClass?: any;
  isWidget?: boolean;
  footer?: any;
}

const Notification: FC<NotificationProps> = ({
  icon = faMegaphone,
  iconBorderColor = 'border-primary-blue-hover',
  textColor = 'text-primary-blue-hover',
  bgColor = 'bg-secondary-blue',
  headline,
  message,
  ctaButton,
  buttonClass = 'hover:text-primary-blue-hover hover:border-primary-blue-hover',
  isWidget,
  footer,
}) => {
  return (
    <div
      className={classNames('rounded-md py-4 px-6 w-full', bgColor, textColor)}
    >
      <div className="flex gap-3">
        <FontAwesomeIcon
          icon={icon}
          className={classNames(
            'hidden sm:inline text-xl mt-1.5 border-2 p-2 rounded-md',
            iconBorderColor
          )}
        />
        <div className="flex flex-col gap-4 w-full">
          <div
            className={classNames('flex flex-col gap-1', {
              'md:h-[200px]': isWidget,
            })}
          >
            <h3 className="font-bold text-xl">{headline}</h3>
            <div className="text-sm">{message}</div>
          </div>
          <div
            className={classNames(
              'cursor-pointer border-b border-transparent max-w-max',
              buttonClass
            )}
          >
            {ctaButton ? (
              ctaButton
            ) : (
              <>
                <a
                  href="mailto:support@creditkey.com"
                  className="flex gap-1 items-center"
                >
                  Contact Credit Key Support
                  <FontAwesomeIcon icon={faArrowRightLong} className="mt-0.5" />
                </a>
              </>
            )}
          </div>
          {footer && <div>{footer}</div>}
        </div>
      </div>
    </div>
  );
};
export default Notification;
