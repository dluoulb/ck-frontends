import React from 'react';
import { faLockAlt } from '@fortawesome/pro-regular-svg-icons';
import { Form } from 'formik';
import Image from 'next/image';

import PrimaryButton from '@components/buttons/PrimaryButton';
import { ColumnInput, StickyCheckbox, StickyInput } from '@components/inputs';
import { useEntity } from '@contexts/EntityContext';
import vc from '@lib/images/vc_cardart_visa.png';
import { formatCurrency } from '@lib/utils/formatters';

export default function VirtualCardForm({ errors, touched, activePromo, values, setFieldValue }) {
  const { entity } = useEntity();

  const sublimits = {
    max: parseInt(entity?.vc_sub_limits?.limit_amount),
    used:
      parseInt(entity?.vc_sub_limits?.limit_amount) -
      parseInt(entity?.vc_sub_limits?.remaining_limit_amount),
    remaining: parseInt(entity?.vc_sub_limits?.remaining_limit_amount),
    percent: parseFloat(entity?.vc_sub_limits?.limit_percent) * 100,
  };

  const expirationMock = () => {
    const now = new Date();
    return `${String(now.getFullYear()).substring(2)}/${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  return (
    <Form>
      <div className="flex flex-col sm:flex-row justify-between items-center p-2 pb-4 gap-6 border-b border-primary-gray-border">
        <div className="w-[300px] mx-auto relative">
          <Image src={vc} alt="Virtual Card Image" className="rounded-lg" />
          <span className="absolute top-[110px] left-[20px] text-[24px] sm:top-[60px] sm:left-[10px] sm:text-[13px] text-white">
            6219&nbsp;&nbsp;&nbsp;8610&nbsp;&nbsp;&nbsp;2888&nbsp;&nbsp;&nbsp;8075
          </span>
          <span className="absolute top-[150px] left-[20px] text-[18px] sm:top-[80px] sm:left-[10px] sm:text-[10px] text-white">
            {expirationMock()}
          </span>
          <span className="absolute top-[150px] left-[110px] text-[18px] sm:top-[80px] sm:left-[60px] sm:text-[10px] text-white">
            123
          </span>
        </div>
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
              <span className="font-bold text-success">{formatCurrency(sublimits.remaining)}</span>
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
          </div>
        </div>
        <div className="my-4">
          <ColumnInput error={errors?.merchant_name} touched={touched?.merchant_name}>
            <StickyInput
              id="merchant_name"
              name="merchant_name"
              placeholder="Merchant Name"
              type="text"
              values={values}
            />
          </ColumnInput>
          <ColumnInput error={errors.order_amount} touched={touched.order_amount}>
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
      />
      <p className="text-sm text-tertiary-gray">
        *Virtual Card transactions are capped at {sublimits.percent}% of your trade credit limit up
        to a maximum of {formatCurrency(sublimits.max)}.
      </p>
    </Form>
  );
}
