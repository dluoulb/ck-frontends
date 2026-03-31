import React from 'react';
import { faArrowRight } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useEntity } from '@contexts/EntityContext';
import { ckaLink } from '@lib/constants/SiteVariables';

interface CkaInfoProps {
  notice?: boolean;
}

export default function CkaInfo({ notice }: CkaInfoProps) {
  const { entity, entityLoading } = useEntity();
  const isAmazonExclusive = entity?.isAmazonExclusive === true;

  if (entityLoading || isAmazonExclusive) return null;

  return (
    <div className="text-sm lg:text-base h-full">
      <div className="flex justify-start">
        <p className="text-sm text-gray-600">
          {notice ? '*' : ''}If you'd like to pay with Credit Key at a merchant who doesn't accept
          Mastercard, you can send us your invoice directly and we will apply the payment for you
          using your existing line of credit.
          <a
            href={ckaLink}
            target="_blank"
            className="text-primary-blue hover:text-primary-blue-hover font-semibold ml-2"
          >
            Learn more <FontAwesomeIcon icon={faArrowRight} />
          </a>
        </p>
      </div>
    </div>
  );
}
