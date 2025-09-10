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
import BillingCycleDisplay from './BillingCycleDisplay';

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
    <div className="p-6">
      <div className="flex items-center gap-2.5 border-b border-border-gray pb-2">
        <p className="text-lg md:text-xl font-bold">Default Settings</p>
      </div>
      <div className="mt-2">
        {entityLoading ? <Loading className="w-14 h-14 my-36" /> :
          <>
            <div className="flex flex-col">
              <div className="font-semibold text-secondary-gray text-base md:text-lg">
                Primary Payment Method
              </div>
              <div className="flex flex-col sm:flex-row md:flex-col xl:flex-row justify-between items-start sm:items-center md:items-start xl:items-center text-sm">
                <div className="flex flex-row lg:gap-1 pb-1">
                  <p>Default:</p>
                  <strong>
                    {defaultPM?.label || defaultPM?.account_holder}{' '}
                    {defaultPM?.account_number_masked}
                  </strong>
                </div>
                <Link
                  href="/payment_methods"
                  className="font-semibold text-primary-blue flex gap-1 hover:text-blue-900 border-b border-transparent hover:border-primary-blue-hover"
                >
                  <span className="hidden xs:inline">Manage</span>
                  <span>
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      className="inline xs:hidden"
                    />
                  </span>
                </Link>
              </div>
            </div>
              <BillingCycleDisplay />
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
