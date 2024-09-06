import React from 'react';
import {
  faArrowRightLong,
  faExclamationTriangle,
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import { BaseGridItem } from '@components/BaseGrid';
import Notification from '@components/Notification';
import { useBorrowerDeps, useEntity } from '@contexts';
import DefaultSettings from './DefaultSettings';

export default function SettingsWidget() {
  const { entity } = useEntity();
  const { isLoading, paymentMethods, paymentMethodsError } = useBorrowerDeps();

  if (!isLoading && paymentMethodsError)
    return (
      <BaseGridItem gridConfig="col-span-5 md:col-span-2 mx-2 md:ml-3 md:mr-1.5 !p-0 h-full">
        <Notification
          icon={faExclamationTriangle}
          textColor="text-error"
          bgColor="bg-error/20 min-h-full"
          headline="An Error Occurred"
          isWidget={true}
          message={`Unable to collect available ${entity?.type} payment method data. Please contact Credit Key Support for assistance.`}
        />
      </BaseGridItem>
    );

  if (!isLoading && !paymentMethods)
    return (
      <BaseGridItem gridConfig="col-span-5 md:col-span-2 mx-2 md:ml-3 md:mr-1.5 !p-0 h-full">
        <Notification
          icon={faExclamationTriangle}
          textColor="text-error"
          bgColor="bg-error/20 min-h-full"
          headline="Payment Method Required"
          message={`Please connect a payment method immediately.`}
          isWidget={true}
          ctaButton={
            <>
              <Link href="/borrower/payment_methods" className="font-medium">
                Connect Payment Method
              </Link>
              <FontAwesomeIcon icon={faArrowRightLong} className="mt-0.5" />
            </>
          }
        />
      </BaseGridItem>
    );

  return (
    <BaseGridItem gridConfig="col-span-5 md:col-span-2 !bg-primary-blue/10 mx-2 md:ml-3 md:mr-1.5">
      <DefaultSettings />
    </BaseGridItem>
  );
}
