import React, { useRef, useState } from 'react';
import { Form, Formik } from 'formik';

import OutlineButton from '@components/buttons/OutlineButton';
import PrimaryButton from '@components/buttons/PrimaryButton';
import { ColumnInput, StickyInput } from '@components/inputs';
import { useBorrowerDeps } from '@contexts';
import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import { createCompanyUser, validatePhone } from '@lib/actions/users';
import { emailRegex } from '@lib/constants/SiteVariables';
import UserRecord from '@lib/records/user';

type FormValues = {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

export default function AddUserForm({ company, close }) {
  const api = useApi();
  const form = useRef(null);
  const { makeToast } = useToast();
  const [loading, setLoading] = useState(false);
  const { refetchCompanyUsers } = useBorrowerDeps();

  const checkPhone = async (val) => {
    const res = await validatePhone(api, val);
    return res?.data?.result;
  };

  const onSubmit = async (values, { resetForm, setFieldError }) => {
    createCompanyUser(api, company?.id, new UserRecord(values))
      .then(() => {
        resetForm();
        close();
        makeToast('New Purchaser User Added!', 'success');
        refetchCompanyUsers();
        setLoading(false);
      })
      .catch((err) => {
        switch (err?.response?.data?.error) {
          case 'Invalid phone number':
            setFieldError('phone', '* Invalid phone number. Please try again.');
            break;
          case 'Phone number already in use':
            setFieldError(
              'phone',
              '* Phone number already in use. Please try again.'
            );
            break;
          case 'Email address already in use':
            setFieldError(
              'email',
              '* Email address already in use. Please try again.'
            );
            break;
          default:
            makeToast(
              'An error occurred. Please try again or contact our support team.',
              'error'
            );
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <Formik
      innerRef={form}
      initialValues={{
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
      }}
      validate={async (values) => {
        const errors: FormErrors = {};

        if (!values.first_name) errors.first_name = '* Required';
        if (!values.last_name) {
          errors.last_name = '* Required';
        }
        if (!values.phone) errors.phone = '* Required';
        if (!values.email) {
          errors.email = '* Required';
        } else if (!emailRegex.test(values.email)) {
          errors.email = '* Invalid email address';
        }
        return errors;
      }}
      onSubmit={async (values, { setFieldError, resetForm }) => {
        setLoading(true);
        const phoneCheck = await checkPhone(values.phone);

        if (!phoneCheck.valid) {
          setFieldError('phone', '* Please enter a valid phone number');
        }
        phoneCheck.valid && onSubmit(values, { resetForm, setFieldError });
      }}
    >
      {({ errors, touched, values }) => (
        <Form>
          <div className="w-full xs:w-1/2 my-4">
            <ColumnInput error={errors.first_name} touched={touched.first_name}>
              <StickyInput
                id="first_name"
                placeholder="First Name"
                values={values}
              />
            </ColumnInput>
            <ColumnInput error={errors.last_name} touched={touched.last_name}>
              <StickyInput
                id="last_name"
                placeholder="Last Name"
                values={values}
              />
            </ColumnInput>
            <ColumnInput error={errors.phone} touched={touched.phone}>
              <StickyInput
                id="phone"
                type="tel"
                mask="(999) 999-9999"
                placeholder="Mobile Number"
                values={values}
              />
            </ColumnInput>
            <ColumnInput error={errors.email} touched={touched.email}>
              <StickyInput
                id="email"
                type="email"
                placeholder="Email"
                values={values}
              />
            </ColumnInput>
            <div className="flex flex-col xs:flex-row gap-3">
              <PrimaryButton
                ariaLabel="save-purchaser-user"
                buttonText="Add Purchaser User"
                buttonColor="bg-primary-blue"
                containerClass="max-w-[30%]"
                hoverClass="hover:bg-primary-blue-hover"
                disabled={loading}
                isLoading={loading}
                isSmall={true}
              />
              <OutlineButton
                ariaLabel="Close"
                buttonText="Cancel"
                buttonColor="border-primary-blue text-primary-blue"
                containerClass="max-w-[30%]"
                hoverClass=" hover:text-primary-blue-hover hover:border-primary-blue-hover"
                onClick={close}
                disabled={loading}
                isSmall={true}
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
