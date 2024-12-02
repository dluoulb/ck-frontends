import React, { useEffect, useState } from 'react';
import {
  faInfoCircle,
  faPenToSquare,
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useEntity } from '@contexts/EntityContext';
import DefaultTermsDisplay from './DefaultTermsDisplay';
import Loading from '@components/Loading';

export default function DefaultSettings() {
  const { entity, entityLoading } = useEntity();
  const { paymentMethods, defaultTermSettings, defaultCard, defaultBank } =
    useBorrowerDeps();
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
        {entityLoading ? <Loading className="w-14 h-14 my-36" /> :
          <>
            <div className="flex flex-col">
              <div className="font-semibold text-secondary-gray text-base md:text-lg">
                Primary Payment Method
              </div>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between text-sm">
                <div className="flex flex-col lg:flex-row lg:gap-1 pb-1">
                  <p>Default:</p>
                  <strong>
                    {defaultPM?.label || defaultPM?.account_holder}{' '}
                    {defaultPM?.account_number_masked}
                  </strong>
                </div>
                <Link
                  href="/borrower/payment_methods"
                  className="font-semibold text-primary-blue-hover flex gap-1 hover:text-blue-900 border-b border-transparent hover:border-primary-blue-hover"
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
                {!defaultTermSettings?.length ? null : <p>Default Terms</p>}
              </div>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                {defaultTermSettings && <DefaultTermsDisplay />}
              </div>
            </div>
          </>
        }
      </div>
    </div>
  );
}
