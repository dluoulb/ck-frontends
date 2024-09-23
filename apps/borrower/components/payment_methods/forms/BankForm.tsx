import React, { useEffect, useRef, useState } from 'react';
import { Form, Formik } from 'formik';

import PrimaryButton from '@components/buttons/PrimaryButton';
import { ColumnInput, StickyCheckbox, StickyInput } from '@components/inputs';
import Loading from '@components/Loading';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useUser } from '@contexts/UserContext';
import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import {
  createPaymentMethodBank,
  generateBankAgreement,
} from '@lib/actions/payment_methods';
import PaymentMethodRecord from '@lib/records/payment_method';
import ErrorAlert from '../modals/ErrorAlert';

type FormValues = {
  agree: boolean;
  bank_routing: string;
  bank_account: string;
  account_holder: string;
  user_id: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

export default function BankForm({ hasAlert, next, setHasAlert, toggleModal }) {
  const api = useApi();
  const form = useRef(null);
  const { user } = useUser();

  const { makeToast } = useToast();
  const { refetchPaymentMethods } = useBorrowerDeps();

  const [loading, setLoading] = useState(false);
  const [bankAgreement, setBankAgreement] = useState('');
  const [agreementLoading, setAgreementLoading] = useState(false);

  useEffect(() => {
    setAgreementLoading(true);
    generateBankAgreement(api, user)
      .then((res) => {
        res && setBankAgreement(res);
      })
      .then(() => setAgreementLoading(false))
      .catch(() =>
        makeToast(
          'Unable to generate bank agreement. Please try again or contact our support team.',
          'error'
        )
      );
  }, [user]);

  const onSubmit = async (values, { setFieldError, resetForm }) => {
    setLoading(true);
    createPaymentMethodBank(api, new PaymentMethodRecord(values))
      .then(() => {
        refetchPaymentMethods();
        makeToast('Payment Method Successfully Created', 'success');
        resetForm();
        toggleModal();
      })
      .catch((err) => {
        const invalid = err?.response?.data?.error?.includes('invalid_bank');
        const excessive =
          err?.response?.data?.error?.includes('excessive_attempts');

        if (excessive) {
          setHasAlert(true);
        } else if (invalid) {
          setFieldError(
            'bank_account',
            'Double check the account number and try again.'
          );
          setFieldError(
            'bank_routing',
            'Double check the routing number and try again.'
          );
        } else {
          makeToast(
            'An error occurred. Please try again or contact our support team.',
            'error'
          );
          toggleModal();
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <Formik
      innerRef={form}
      initialValues={{
        agree: '',
        bank_routing: '',
        bank_account: '',
        account_holder: '',
        user_id: user?.id,
      }}
      validate={async (values) => {
        const errors: FormErrors = {};

        if (!values.agree) errors.agree = '* Required';
        if (!values.bank_routing) {
          errors.bank_routing = '* Required';
        } else if (values.bank_routing.trim().length < 9) {
          errors.bank_routing = 'Routing No. must be exactly 9 characters long';
        }
        if (!values.account_holder) errors.account_holder = '* Required';
        if (!values.bank_account) errors.bank_account = '* Required';

        return errors;
      }}
      onSubmit={onSubmit}
    >
      {({ values, touched, errors, setFieldValue }) => {
        const disabled = Object.values(errors).some((e) => !!e);
        return (
          <Form>
            <div className="flex flex-col m-auto w-4/5">
              <ErrorAlert hasAlert={hasAlert} next={next} />
              <ColumnInput
                error={errors.bank_routing}
                touched={touched.bank_routing}
              >
                <StickyInput
                  id="bank_routing"
                  inputMode="numeric"
                  mask="999999999"
                  placeholder="Routing Number"
                  values={values}
                />
              </ColumnInput>
              <ColumnInput
                error={errors.bank_account}
                touched={touched.bank_account}
              >
                <StickyInput
                  id="bank_account"
                  inputMode="numeric"
                  mask={/^\d*$/}
                  placeholder="Account Number"
                  values={values}
                />
              </ColumnInput>
              <ColumnInput
                error={errors.account_holder}
                touched={touched.account_holder}
              >
                <StickyInput
                  id="account_holder"
                  placeholder="Name on Account"
                  values={values}
                />
              </ColumnInput>
              <div className="form-control block w-full p-3 text-sm font-normal text-secondary-gray bg-white bg-clip-padding border border-solid border-primary-gray-border rounded transition ease-in-out m-0 focus:text-primary-blue-hover focus:bg-white focus:border-primary-blue-hover focus:outline-none h-40 max-h-40 overflow-y-scroll">
                {agreementLoading ? (
                  <Loading className="w-5 h-5 my-2 !text-primary" />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: bankAgreement }} />
                )}
              </div>

              <div className="my-2">
                <StickyCheckbox
                  id="agree"
                  placeholder="I authorize Credit Key to charge scheduled payments to my bank account."
                  errors={errors}
                  setFieldValue={setFieldValue}
                />
              </div>
              <PrimaryButton
                ariaLabel="save-payment-method-button"
                buttonText="Save Payment Method"
                buttonColor="bg-primary-blue"
                hoverClass="hover:bg-primary-blue-hover"
                disabled={disabled || loading || agreementLoading}
                isLoading={loading}
              />
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
