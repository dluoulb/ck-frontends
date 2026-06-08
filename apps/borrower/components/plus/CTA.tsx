import React from 'react';
import { faSpinnerThird } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useEntity } from '@contexts/EntityContext';
import { useTrialEligibility } from '@hooks/useSubscription';

type CTAProps = {
  onJoinClick: () => void;
};

export default function CTA({ onJoinClick }: CTAProps) {
  const { entity } = useEntity();
  const { isTrialEligible, trialEligibilityLoading } = useTrialEligibility(entity?.id ?? '');

  const buttonText = isTrialEligible ? 'Start 30-Day Free Trial' : 'Join Credit Key Plus';

  return (
    <div className="bg-[#F4F8FF] p-6 my-6 gap-2 flex flex-col border border-primary-gray-border rounded-lg">
      <h3 className="text-2xl font-bold">Ready to earn?</h3>
      <p>The smarter way to manage business spending with unlimited rewards.</p>
      <button
        onClick={onJoinClick}
        className="bg-primary-blue text-white px-4 py-2 text-xs sm:text-sm rounded-lg font-semibold hover:bg-primary-blue-hover transition-colors self-start flex items-center gap-2"
        aria-busy={trialEligibilityLoading}
      >
        {trialEligibilityLoading && (
          <FontAwesomeIcon icon={faSpinnerThird} spin className="text-sm" aria-hidden="true" />
        )}
        {buttonText}
      </button>
    </div>
  );
}
