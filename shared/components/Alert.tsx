import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

interface AlertProps {
  icon?: any;
  alertText: any;
  alertSubtext?: string;
  containerClass?: string;
}

const Alert: FC<AlertProps> = ({ icon, alertText, alertSubtext, containerClass }) => {
  return (
    <div role="error" className={classNames('rounded-md', containerClass)}>
      <div className="flex items-center gap-3">
        <FontAwesomeIcon
          icon={icon}
          className="h-5 w-5 text-error hidden sm:inline mt-0.5"
          aria-hidden="true"
        />
        <div className="flex flex-col items-center sm:items-start">
          <h3
            className={
              alertSubtext
                ? 'font-semibold tracking-wide text-error mt-0.5'
                : 'text-xs sm:text-sm text-error sm:mt-0.5'
            }
          >
            {alertText}
          </h3>
          <p className="text-sm text-error">{alertSubtext}</p>
        </div>
      </div>
    </div>
  );
};

export default Alert;
