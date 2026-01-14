import React, { useState } from 'react';
import { faCirclePlus } from '@fortawesome/pro-regular-svg-icons';
import { Form, Formik } from 'formik';

import useVirtualCardBalance from '@apps/borrower/hooks/useVirtualCardBalance';
import PrimaryButton from '@components/buttons/PrimaryButton';
import { ColumnInput, StickyInput } from '@components/inputs';
import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import { addFunds } from '@lib/actions/virtualcards';
import { formatCurrency } from '@lib/utils/formatters';
import FullStory from '@lib/utils/fullstory';

type FormValues = {
  amount: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

export default function AddFundsModal({ next }) {
  const { entity, fetchEntity } = useEntity();
  const { user } = useUser();
  const api = useApi();
  const { makeToast } = useToast();
  const [loading, setLoading] = useState(false);
  const { balance, refetchBalance } = useVirtualCardBalance();

  const vcSubLimit = parseFloat(entity?.vc_sub_limits?.limit_amount);
  const remainingVcSubLimit = parseFloat(entity?.vc_sub_limits?.remaining_limit_amount);

  const onSubmit = async (values) => {
    const cleanAmount = parseFloat(values.amount.replace(/[^.0-9]/g, ''));
    setLoading(true);
    addFunds(api, cleanAmount)
      .then(() => {
        const fullstory = new FullStory();
        const formattedAmount = formatCurrency(cleanAmount);
        makeToast(`Added ${formattedAmount} to card`, 'success');
        fullstory.addFundsToCardEvent(user?.id, entity?.id, formattedAmount);
        refetchBalance();
        fetchEntity();
        next();
      })
      .catch((error) => {
        if (error?.response?.data?.error === 'Balance addition error, balance already covered') {
          makeToast(
            'Amount already covered by card balance. If you need additional funds, enter the total desired amount.',
            'error',
          );
        } else {
          makeToast('Failed to add funds to card', 'error');
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div role={AddFundsModal.role}>
      <section>
        <div className="my-2 space-y-4">
          <p className="text-center text-2xl font-bold tracking-wider">Add Funds</p>
          <div>
            <p className="text-gray-500">
              You can transfer up to {formatCurrency(vcSubLimit, true)} from your existing credit
              line onto your Credit Key Prepaid Mastercard®.
            </p>
          </div>
          <div>
            <p className="text-gray-500">
              If you don't end up using the amount within 24 hours, it'll automatically return to
              your main credit line. There are no fees or penalties associated with this and you can
              always add the funds back once you are ready to make your purchase.
            </p>
          </div>
          <div className="flex flex-col xs:flex-row justify-start">
            <p>Available Funds:</p>
            <span className="font-bold text-success ml-2">
              {formatCurrency(remainingVcSubLimit)}
            </span>
          </div>
        </div>
        <Formik
          initialValues={{
            amount: '',
          }}
          validate={async (values) => {
            const errors: FormErrors = {};

            if (!values.amount) errors.amount = '* Required';

            const cleanAmount = parseFloat(values.amount.replace(/[^.0-9]/g, ''));
            if (cleanAmount === 0.0 || isNaN(cleanAmount)) {
              errors.amount = '* Amount must be greater than zero (0)';
            }

            if (cleanAmount > remainingVcSubLimit + (balance?.amount || 0)) {
              errors.amount =
                '* Amount exceeds remaining card limit. Please lower amount and try again.';
            }

            return errors;
          }}
          onSubmit={onSubmit}
        >
          {({ errors, touched, values }) => (
            <Form>
              <section className="mt-2 xs:mt-6">
                <div className="my-4">
                  <ColumnInput
                    error={errors?.amount}
                    touched={touched?.amount}
                    className="flex flex-col sm:flex-row justify-between sm:gap-x-1"
                  >
                    <StickyInput
                      id="amount"
                      name="transfer_funds_amount"
                      mask={Number}
                      thousandsSeparator=","
                      scale={2}
                      radix="."
                      padFractionalZeros={true}
                      placeholder="Enter desired amount"
                      values={values}
                    />
                  </ColumnInput>
                </div>
              </section>
              <PrimaryButton
                ariaLabel="transfer-funds-button"
                icon={faCirclePlus}
                buttonText="Add Funds to Card"
                buttonColor="bg-primary-blue"
                hoverClass="hover:bg-primary-blue-hover"
                isLoading={loading}
                disabled={loading}
              />
            </Form>
          )}
        </Formik>
      </section>
    </div>
  );
}

AddFundsModal.role = 'add-funds-modal-component';
