import React from 'react';
import { faExclamationTriangle } from '@fortawesome/pro-regular-svg-icons';
import Link from 'next/link';

import { BaseGridItem } from '@components/BaseGrid';
import Notification from '@components/Notification';
import { useBorrowerDeps } from '@contexts';
import DefaultSettings from './DefaultSettings';

export default function SettingsWidget() {
  const { type, isLoading, errors, paymentMethods } = useBorrowerDeps();

  if (!isLoading && errors?.paymentMethodsError)
    return (
      <BaseGridItem gridConfig="col-span-5 md:col-span-2 mx-2 md:ml-3 md:mr-1.5 !p-0 h-full">
        <Notification
          icon={faExclamationTriangle}
          textColor="text-error"
          bgColor="bg-error/20 min-h-full"
          headline="An Error Occurred"
          isWidget={true}
          message={`Unable to collect available ${type} payment method data. Please contact Credit Key Support for assistance.`}
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
            <Link href="/borrower/payment_methods" className="font-medium">
              Connect Payment Method
            </Link>
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
