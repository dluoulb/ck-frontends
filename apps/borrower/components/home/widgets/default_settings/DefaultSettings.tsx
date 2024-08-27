import React, { useEffect, useState } from 'react';
import {
  faInfoCircle,
  faPenToSquare,
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import usePaymentMethods from '@apps/borrower/hooks/usePaymentMethods';
import DefaultTermsDisplay from './DefaultTermsDisplay';

export default function DefaultSettings({
  entity,
  paymentMethods,
  defaultTerms,
}) {
  const { defaultCard, defaultBank } = usePaymentMethods(paymentMethods);
  const [defaultPM, setDefaultPM] = useState(null);

  useEffect(() => {
    if (entity && paymentMethods) {
      entity?.type === 'company'
        ? setDefaultPM(defaultBank)
        : setDefaultPM(defaultCard);
    }
  }, [entity, paymentMethods]);

  return (
    <div className="px-3 p-2">
      <div className="flex items-center gap-2.5 border-b border-primary-blue-hover/30 pb-3">
        <FontAwesomeIcon
          icon={faInfoCircle}
          className="text-primary-blue text-base lg:text-xl"
        />

        <p className="text-lg md:text-xl font-bold">Default Settings</p>
      </div>
      <div className="space-y-4 md:space-y-7 mt-3 md:mt-6">
        <div className="flex flex-col">
          <div className="font-semibold text-secondary-gray text-base md:text-lg">
            Primary Payment Method
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex gap-1 pb-1">
              <p>Default:</p>
              <strong>
                {defaultPM?.label || defaultPM?.account_holder}{' '}
                {defaultPM?.account_number_masked}
              </strong>
            </div>
            <Link
              href="/borrower/payment-methods"
              className="font-semibold text-primary-blue-hover flex gap-1 hover:text-blue-900 hover:border-b hover:border-primary-blue-hover"
            >
              <span className="hidden xs:inline">Change</span>
              <span>
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  className="inline xs:hidden"
                />
              </span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="font-semibold text-secondary-gray text-base md:text-lg">
            {!defaultTerms?.length ? null : <p>Default Terms</p>}
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            {defaultTerms && (
              <DefaultTermsDisplay
                defaultTerms={defaultTerms}
                entity={entity}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
