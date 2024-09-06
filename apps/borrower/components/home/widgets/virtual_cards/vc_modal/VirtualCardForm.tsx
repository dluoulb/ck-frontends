import React from 'react';
import { faLockAlt } from '@fortawesome/pro-regular-svg-icons';
import { Form } from 'formik';
import Image from 'next/image';

import PrimaryButton from '@components/buttons/PrimaryButton';
import { ColumnInput, StickyCheckbox, StickyInput } from '@components/inputs';
import { useEntity } from '@contexts';
import vc from '@lib/images/vc-image.png';
import { formatCurrency } from '@lib/utils/formatters';

export default function VirtualCardForm({
  errors,
  touched,
  activePromo,
  values,
  setFieldValue,
  onSubmit,
}) {
  const { entity } = useEntity();

  const sublimits = {
    max: parseInt(entity?.vc_sub_limits?.limit_amount),
    used:
      parseInt(entity?.vc_sub_limits?.limit_amount) -
      parseInt(entity?.vc_sub_limits?.remaining_limit_amount),
    remaining: parseInt(entity?.vc_sub_limits?.remaining_limit_amount),
  };

  return (
    <Form>
      <div className="flex flex-col sm:flex-row justify-between items-center p-2 pb-4 gap-6 border-b border-primary-gray-border">
        <Image
          src={vc}
          alt="Virtual Card Image"
          className="w-3/4 xs:w-1/2 sm:w-2/5 mx-auto"
        />
        <div className="flex flex-col items-center sm:items-start gap-2 w-full">
          <div className="flex justify-between font-semibold text-lg text-center">
            <p>Virtual Card Limit</p>
            <span className="text-sm">*</span>
          </div>
          <div className="space-y-2 w-full">
            <div className="flex flex-col xs:flex-row justify-between items-center">
              <p>Maximum Amount:</p>
              <span className="font-bold text-primary-blue-hover">
                {formatCurrency(sublimits.max)}
              </span>
            </div>
            <div className="flex flex-col xs:flex-row justify-between items-center">
              <p>Amount in Use:</p>
              <span className="font-bold text-secondary-gray">
                {formatCurrency(sublimits.used)}
              </span>
            </div>
            <div className="flex flex-col xs:flex-row justify-between items-center">
              <p>Remaining Amount:</p>
              <span className="font-bold text-success">
                {formatCurrency(sublimits.remaining)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <section className="mt-2 xs:mt-6">
        <div className="mx-6">
          <div>
            <p className="text-center text-2xl xs:text-3xl my-1 font-semibold">
              Credit Key Virtual Card
            </p>
            <p className="text-center text-opaque-navy mb-0">
              You've been selected for VIP access to virtual cards!
            </p>
          </div>
        </div>
        <div className="my-4">
          <ColumnInput
            error={{
              merchant_name: errors?.merchant_name,
              merchant_url: errors?.merchant_url,
            }}
            touched={{
              merchant_name: touched?.merchant_name,
              merchant_url: touched?.merchant_url,
            }}
            className="flex flex-col sm:flex-row justify-between sm:gap-x-1"
          >
            <StickyInput
              id="merchant_name"
              name="merchant_name"
              placeholder="Merchant Name"
              type="text"
              values={values}
            />
            <StickyInput
              id="merchant_url"
              name="merchant_url"
              placeholder="Merchant Website"
              type="text"
              values={values}
            />
          </ColumnInput>
          <ColumnInput
            error={errors.order_amount}
            touched={touched.order_amount}
          >
            <StickyInput
              id="order_amount"
              name="order_amount"
              mask={Number}
              thousandsSeparator=","
              scale={2}
              radix="."
              padFractionalZeros={true}
              placeholder="Order Amount"
              values={values}
            />
          </ColumnInput>
        </div>

        {((activePromo && errors.order_amount) || values.bypass) && (
          <div className="mx-2 mb-2">
            <StickyCheckbox
              id="bypass"
              placeholder={`Skip promotion, get 0% for 30 days`}
              errors={errors}
              setFieldValue={setFieldValue}
            />
          </div>
        )}
      </section>
      <PrimaryButton
        ariaLabel="save-default-terms-button"
        buttonText="Continue"
        buttonColor="bg-primary-blue"
        hoverClass="hover:bg-primary-blue-hover"
        icon={faLockAlt}
        onClick={() => onSubmit(values)}
      />
      <p className="text-sm text-tertiary-gray">
        *Virtual Card transactions are capped at 50% of your trade credit limit
        up to a maximum of $25,000.
      </p>
    </Form>
  );
}
