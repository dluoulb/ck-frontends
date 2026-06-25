import React, { useEffect, useRef, useState } from 'react';
import { Form, Formik } from 'formik';

import PrimaryButton from '@components/buttons/PrimaryButton';
import { ColumnInput, StickyCheckbox, StickyInput } from '@components/inputs';
import Loading from '@components/Loading';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import { createPaymentMethodBank, generateBankAgreement } from '@lib/actions/payment_methods';
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

export type BankFormValues = {
  bank_routing: string;
  bank_account: string;
  account_holder: string;
};

export default function BankForm({
  hasAlert,
  next,
  setHasAlert,
  toggleModal,
  createVcFlow,
  submitButtonText = 'Save Payment Method',
  persistedValues,
  onBankValuesChange,
  onPaymentMethodCreated,
}: {
  hasAlert?: boolean;
  next?: () => void;
  setHasAlert?: (v: boolean) => void;
  toggleModal?: () => void;
  createVcFlow?: boolean;
  submitButtonText?: string;
  persistedValues?: Partial<BankFormValues>;
  onBankValuesChange?: (values: BankFormValues) => void;
  onPaymentMethodCreated?: () => void;
}) {
  const api = useApi();
  const form = useRef(null);
  const { user } = useUser();

  const { makeToast } = useToast();
  const makeToastRef = useRef(makeToast);
  const { refetchPaymentMethods } = useBorrowerDeps();
  const { fetchEntity } = useEntity();
  const userId = user?.id;

  const [loading, setLoading] = useState(false);
  const [bankAgreement, setBankAgreement] = useState('');
  const [agreementUserId, setAgreementUserId] = useState<string | null>(null);

  useEffect(() => {
    makeToastRef.current = makeToast;
  }, [makeToast]);

  useEffect(() => {
    if (!userId) return;

    let isActive = true;

    generateBankAgreement(api, { id: userId })
      .then((res) => {
        if (!isActive) return;

        setBankAgreement(res || '');
        setAgreementUserId(userId);
      })
      .catch(() => {
        if (!isActive) return;

        setBankAgreement('');
        setAgreementUserId(userId);
        makeToastRef.current(
          'Unable to generate bank agreement. Please try again or contact our support team.',
          'error',
        );
      });

    return () => {
      isActive = false;
    };
  }, [api, userId]);

  const agreementLoading = !userId || agreementUserId !== userId;
  const currentBankAgreement = agreementUserId === userId ? bankAgreement : '';

  const onBankValuesChangeRef = useRef(onBankValuesChange);
  useEffect(() => {
    onBankValuesChangeRef.current = onBankValuesChange;
  }, [onBankValuesChange]);

  useEffect(() => {
    const handleWindowBlur = () => {
      const currentValues = form.current?.values;
      if (currentValues && onBankValuesChangeRef.current) {
        onBankValuesChangeRef.current({
          bank_routing: currentValues.bank_routing,
          bank_account: currentValues.bank_account,
          account_holder: currentValues.account_holder,
        });
      }
    };

    window.addEventListener('blur', handleWindowBlur);
    return () => window.removeEventListener('blur', handleWindowBlur);
  }, []);

  const onSubmit = async (values, { setFieldError, resetForm }) => {
    setLoading(true);
    createPaymentMethodBank(api, new PaymentMethodRecord(values))
      .then(() => {
        if (createVcFlow && onPaymentMethodCreated) {
          onPaymentMethodCreated();
        } else {
          fetchEntity();
        }
        refetchPaymentMethods();
        makeToast('Payment Method Successfully Created', 'success');
        resetForm();
        if (createVcFlow) {
          next();
        } else {
          toggleModal();
        }
      })
      .catch((err) => {
        const invalid = err?.response?.data?.error?.includes('invalid_bank');
        const excessive = err?.response?.data?.error?.includes('excessive_attempts');

        if (excessive) {
          fetchEntity();
          setHasAlert(true);
        } else if (invalid) {
          setFieldError('bank_account', 'Double check the account number and try again.');
          setFieldError('bank_routing', 'Double check the routing number and try again.');
        } else {
          makeToast('An error occurred. Please try again or contact our support team.', 'error');
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
        bank_routing: persistedValues?.bank_routing ?? '',
        bank_account: persistedValues?.bank_account ?? '',
        account_holder: persistedValues?.account_holder ?? '',
        user_id: userId,
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
            <div className="flex flex-col m-auto w-full ph-no-capture">
              <ErrorAlert hasAlert={hasAlert} next={next} />
              <ColumnInput error={errors.bank_routing} touched={touched.bank_routing}>
                <StickyInput
                  id="bank_routing"
                  inputMode="numeric"
                  mask="999999999"
                  placeholder="Routing Number"
                  values={values}
                />
              </ColumnInput>
              <ColumnInput error={errors.bank_account} touched={touched.bank_account}>
                <StickyInput
                  id="bank_account"
                  inputMode="numeric"
                  mask={/^\d*$/}
                  placeholder="Account Number"
                  values={values}
                />
              </ColumnInput>
              <ColumnInput error={errors.account_holder} touched={touched.account_holder}>
                <StickyInput id="account_holder" placeholder="Name on Account" values={values} />
              </ColumnInput>
              <div className="form-control block w-full bg-secondary-blue p-3 text-xs sm:text-sm font-normal text-secondary-gray bg-clip-padding border border-solid border-primary-gray-border rounded transition ease-in-out m-0 focus:text-primary-blue-hover focus:bg-white focus:border-primary-blue-hover focus:outline-none h-40 max-h-40 overflow-y-scroll">
                {agreementLoading ? (
                  <Loading className="w-5 h-5 my-2 !text-primary" />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: currentBankAgreement }} />
                )}
              </div>

              <div className="p-3 pt-1.5 my-2 bg-gray-50 border border-gray-200 rounded">
                <StickyCheckbox
                  id="agree"
                  placeholder="I authorize Credit Key to charge scheduled payments to my bank account."
                  placeholderClass="font-semibold"
                  errors={errors}
                  setFieldValue={setFieldValue}
                />
                <div className="text-xs text-gray-500 mt-2 ml-5">
                  This authorization will remain in effect until canceled.
                </div>
              </div>
              <PrimaryButton
                ariaLabel="save-payment-method-button"
                buttonText={submitButtonText}
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
