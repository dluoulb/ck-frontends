import React, { useState } from 'react';
import { faLockAlt } from '@fortawesome/pro-regular-svg-icons';
import { Form, Formik } from 'formik';

import PrimaryButton from '@components/buttons/PrimaryButton';
import StickyInput from '@components/inputs/StickyInput';
import { emailRegex } from '@lib/constants/SiteVariables';

// TODO: MAKE THIS DYNAMIC ONCE WE GET TO OTHER UIs
const type = 'email';
const label = 'Email Address';

export default function UserVerification({
  defaultValue,
  onSubmit,
  buttonText = 'Next',
  loading,
}) {
  const [valid, setValid] = useState(false);

  return (
    <div role="form">
      <Formik
        initialValues={{
          contact: defaultValue,
        }}
        onSubmit={(values) => {
          onSubmit(values, type);
        }}
      >
        {({ values }) => (
          <Form>
            <div className="my-3">
              <StickyInput
                id="contact"
                name="contact"
                type="text"
                placeholder={label}
                mask={[
                  { ckType: 'unknown', mask: '*****' },
                  {
                    ckType: 'phone',
                    mask: '(999) 999-9999',
                    definitions: { 9: /\d/ },
                  },
                  { ckType: 'email', mask: /^\S*@?\S*$/gm },
                ]}
                dispatch={(appended, masked) => {
                  const typed = `${masked.value}${appended}`;
                  const newMask = masked.compiledMasks.find((m) => {
                    return m.ckType === type;
                  });

                  if (newMask.ckType === 'email') {
                    setValid(emailRegex.test(typed));
                  } else {
                    setValid(newMask.isComplete);
                  }

                  return newMask;
                }}
                values={values}
              />
            </div>
            <PrimaryButton
              ariaLabel="login-button"
              buttonText={buttonText}
              buttonColor="bg-primary-blue"
              hoverClass="hover:bg-primary-blue-hover"
              icon={faLockAlt}
              disabled={!valid || loading}
              isLoading={loading}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
}
