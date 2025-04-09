import Tooltip from '@components/Tooltip';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

interface FundsExpirationMessageProps {
  duration: string;
}

export default function FundsExpirationMessage({ duration }: FundsExpirationMessageProps) {
  return (
    <div className="text-sm xl:text-base text-success border-l-4 border-success/80 bg-background-success/60 rounded-r-md">
      <p className="p-3 font-semibold">
        <span>Your funds expire in {duration}</span>
        <Tooltip
          tooltip_text={`If you don't use the amount on the card within ${duration}, it'll automatically return to your main credit line. There are no fees or penalties associated with this and you can always add the funds back once you are ready to make your purchase.`}
          trigger_class="cursor-pointer max-w-max border-none"
          container_class="text-center text-black p-4 px-6 text-sm bg-secondary-blue"
        >
          <FontAwesomeIcon icon={faInfoCircle} className="text-primary-blue ml-2" />
        </Tooltip>
      </p>
    </div>
  );
};


