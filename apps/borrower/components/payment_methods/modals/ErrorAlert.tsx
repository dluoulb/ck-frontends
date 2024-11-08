import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons';

export default function ErrorAlert({ hasAlert, next }) {
  return (
    <div
      className={classNames(
        'bg-background-error border-l-4 rounded-md border-error p-4 my-3',
        { hidden: !hasAlert }
      )}
      role={ErrorAlert.role}
    >
      <div className="flex gap-3 text-error">
        <div className="flex-shrink-0">
          <FontAwesomeIcon icon={faExclamationTriangle} />
        </div>
        <div className="text-sm">
          <p>
            We're having some trouble validating your bank information. You can
            try the following options:
          </p>
          <div className="mt-2">
            <ul role="list" className="list-disc space-y-1">
              <li>
                Double check your routing and account numbers and try to enter
                them again
              </li>
              <li>
                Contact
                <a
                  href="mailto: support@creditkey.com"
                  className="mx-1 cursor-pointer underline"
                >
                  Credit Key Support
                </a>
                for assistance
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

ErrorAlert.role = 'error-alert-component';
