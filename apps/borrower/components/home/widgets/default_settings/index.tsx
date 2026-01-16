import React from 'react';
import { faArrowRightLong, faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import { BaseGridItem } from '@components/BaseGrid';
import Notification from '@components/Notification';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useEntity } from '@contexts/EntityContext';
import DefaultSettings from './DefaultSettings';

export default function SettingsWidget() {
  const { entity } = useEntity();
  const { isLoading, paymentMethods, paymentMethodsError } = useBorrowerDeps();

  if (!isLoading && paymentMethodsError)
    return (
      <BaseGridItem gridConfig="col-span-7 md:col-span-3 mx-2 md:ml-3 md:mr-1.5 !p-0 h-full">
        <Notification
          icon={faExclamationTriangle}
          iconBorderColor="border-error"
          textColor="text-error"
          bgColor="bg-error/20 min-h-full"
          buttonClass="hover:border-error"
          headline="An Error Occurred"
          isWidget={true}
          message={`Unable to collect available ${entity?.type} payment method data. Please contact Credit Key Support for assistance.`}
        />
      </BaseGridItem>
    );

  if (!isLoading && !paymentMethods)
    return (
      <BaseGridItem gridConfig="col-span-7 md:col-span-3 mx-2 md:ml-3 md:mr-1.5 !p-0 h-full">
        <Notification
          icon={faExclamationTriangle}
          iconBorderColor="border-error"
          textColor="text-error"
          bgColor="bg-error/20 min-h-full"
          buttonClass="hover:border-error"
          headline="Payment Method Required"
          message={`Please connect a payment method immediately.`}
          isWidget={true}
          ctaButton={
            <div className="flex items-center gap-2">
              <Link href="/payment_methods" className="font-medium">
                Connect Payment Method
              </Link>
              <FontAwesomeIcon icon={faArrowRightLong} className="mt-0.5" />
            </div>
          }
        />
      </BaseGridItem>
    );

  return (
    <BaseGridItem gridConfig="col-span-7 md:col-span-3 rounded-md !bg-[#F4F8FF] border border-border-gray rounded-md md:mr-2">
      <DefaultSettings />
    </BaseGridItem>
  );
}
