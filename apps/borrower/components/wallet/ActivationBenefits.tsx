import React from 'react';
import { faCheck } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ActivationBenefits({
    title,
    description,
    benefits,
  }) {

  const renderBenefits = () => {
    if (!benefits) return null;

    return benefits.map(benefit => {
      return (
        <div className="flex items-start gap-3" key={benefit}>
          <FontAwesomeIcon icon={faCheck} className="text-success text-2xl" />
          <p className="text-base">
            {benefit}
          </p>
        </div>
      );
    });
  }

  return (
    <div className="h-full p-6 flex flex-col justify-center">
      <h3 className="text-lg font-bold mb-4">
        {title}
      </h3>
      <p className="mb-4 text-base">
        {description}
      </p>
      <div className="space-y-4">
        {renderBenefits()}
      </div>
    </div>
  );
}
