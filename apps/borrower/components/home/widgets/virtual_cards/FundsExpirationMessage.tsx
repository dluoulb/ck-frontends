import React from 'react';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import Tooltip from '@components/Tooltip';

interface FundsExpirationMessageProps {
  duration?: string;
}

export default function FundsExpirationMessage({ duration }: FundsExpirationMessageProps) {
  const message = duration ? `Your funds expire in ${duration}` : 'Your funds expire soon';
  const successClasses = 'text-success border-success/80 bg-background-success/60';
  const warningClasses = 'text-warning border-warning/80 bg-background-warning/60';

  return (
    <div
      className={classNames(
        'text-sm xl:text-base border-l-4 rounded-r-md',
        duration ? successClasses : warningClasses,
      )}
    >
      <p className="p-3 font-semibold">
        <span>{message}</span>
        <Tooltip
          tooltip_text={`If you don't use the amount on the card ${duration ? `within ${duration}` : 'soon'}, it'll automatically return to your main credit line. There are no fees or penalties associated with this and you can always add the funds back once you are ready to make your purchase.`}
          trigger_class="cursor-pointer max-w-max border-none"
          container_class="text-center text-black p-4 px-6 text-sm bg-secondary-blue"
        >
          <FontAwesomeIcon icon={faInfoCircle} className="text-primary-blue ml-2" />
        </Tooltip>
      </p>
    </div>
  );
}
