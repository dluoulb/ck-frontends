import React from 'react';
import { Form, Formik } from 'formik';

import OutlineButton from '@components/buttons/OutlineButton';
import PrimaryButton from '@components/buttons/PrimaryButton';

type UpdateTermsFormValues = {
  paymentTerms: string;
};

export default function UpdateTermsModalForm({
  loan,
  onSubmit,
  toggleTermsModal,
  availableTerms,
}) {
  const initialValues: UpdateTermsFormValues = {
    paymentTerms: loan.product?.installments?.toString() || '',
  };

  const validate = (values) => {
    const errors: Partial<Record<keyof UpdateTermsFormValues, string>> = {};
    if (!values.paymentTerms) {
      errors.paymentTerms = 'Please select a term';
    }
    return errors;
  };

  return (
    <Formik<UpdateTermsFormValues>
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting,
      }) => (
        <Form>
          <label htmlFor="paymentTerms" className="block mb-1 font-bold">
            Payment Terms
          </label>
          <select
            name="paymentTerms"
            value={values.paymentTerms}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full border p-2 mb-2"
          >
            <option value="" disabled>
              Select a term
            </option>
            {availableTerms.map((term) => {
              const label = `${term.term} month${term.term > 1 ? 's' : ''}`;
              const value = term.term;
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
          {touched.paymentTerms && errors.paymentTerms && (
            <p className="text-red-600 text-sm mb-2">{errors.paymentTerms}</p>
          )}

          <div className="w-full flex justify-end items-center gap-3 mt-4">
            <OutlineButton
              ariaLabel="cancel-update"
              buttonText="Cancel"
              buttonColor="border-primary-blue text-primary-blue"
              hoverClass="hover:text-primary-blue-hover hover:border-primary-blue-hover"
              onClick={toggleTermsModal}
              disabled={isSubmitting}
              containerClass="max-w-[140px]"
              type="button"
            />
            <PrimaryButton
              ariaLabel="submit-loan-terms"
              buttonText="Save Changes"
              buttonColor="bg-primary-blue text-white"
              hoverClass="hover:bg-primary-blue-hover"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              containerClass="min-w-[140px] whitespace-nowrap"
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
