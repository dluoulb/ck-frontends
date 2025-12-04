import React from 'react';
import { Form } from 'formik';

import OutlineButton from '@components/buttons/OutlineButton';
import PrimaryButton from '@components/buttons/PrimaryButton';
import PaymentMethods from './PaymentMethods';
import PaymentOptions from './PaymentOptions';
import AutoPayBanner from './AutoPayBanner';

export default function PaymentModalForm({
  order,
  disabled,
  setDisabled,
  setFieldValue,
  toggleModal,
  paymentMethods,
  isSubmitting,
}) {

  return (
    <Form>
      <AutoPayBanner order={order} />
    
      <h2 className="font-bold text-lg">Choose Payment Option</h2>
      <div className="my-4">
        <PaymentOptions
          order={order}
          setFieldValue={setFieldValue}
          disabled={disabled}
          setDisabled={setDisabled}
        />
      </div>
      <h2 className="font-bold text-lg mt-2">
        Choose Payment Method
      </h2>
      <div className="px-1">
        <PaymentMethods order={order} setFieldValue={setFieldValue} paymentMethods={paymentMethods} />
      </div>
      <div className="w-full flex justify-center items-center gap-3">
        <PrimaryButton
          ariaLabel="create-payment-button"
          buttonText="Confirm Payment"
          buttonColor="bg-primary-blue"
          hoverClass="hover:bg-primary-blue-hover"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        />
        <OutlineButton
          ariaLabel="Close"
          buttonText="Cancel"
          buttonColor="border-primary-blue text-primary-blue"
          hoverClass=" hover:text-primary-blue-hover hover:border-primary-blue-hover"
          onClick={toggleModal}
          disabled={isSubmitting}
        />
      </div>
    </Form>
  );
}
