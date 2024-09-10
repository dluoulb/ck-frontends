import React, { useEffect } from 'react';
import { faEnvelope } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ErrorMessage, Form, Formik } from 'formik';
import { useRouter } from 'next/router';

import OutlineButton from '@components/buttons/OutlineButton';
import PrimaryButton from '@components/buttons/PrimaryButton';
import Loading from '@components/Loading';
import { usePossessedUser } from '@contexts/PossessedUserContext';
import useUser from '@hooks/useUser';

type FormValues = { email: string };

type FormErrors = Partial<Record<keyof FormValues, string>>;

export default function PossessUser() {
  const { user } = useUser();
  const { login_as: urlUserId } = useRouter().query;
  const {
    clearPossessedUser,
    loginAsUser,
    searchedEmail,
    setSearchedEmail,
    possessedUser,
    possessedUserLoading,
    possessedEntity,
    possessedEntityLoading,
  } = usePossessedUser();

  const isAdminUser = user?.is_admin_user;
  const entityEmail = possessedEntity?.borrower
    ? possessedEntity?.borrower?.email
    : possessedEntity?.user?.email;

  const clearUser = () => {
    setSearchedEmail(null);
    clearPossessedUser();
  };

  useEffect(() => {
    if (urlUserId) {
      loginAsUser(urlUserId);
    }
  }, [urlUserId]);

  const handleChange = (e) => {
    setSearchedEmail(e.target.value);
  };

  if (!isAdminUser) return null;

  return (
    <div
      role={PossessUser.role}
      className="border-b border-primary-gray-border"
    >
      <div className="rounded-md bg-primary-beige/20 px-6 py-4 w-full mt-6 mb-3">
        <div className="flex">
          <div>
            {possessedUser &&
            !possessedUserLoading &&
            !possessedEntityLoading ? (
              <>
                <h3 className="text-lg font-medium text-yellow-800">
                  Possessing User:
                </h3>
                <div className="mt-2 text-yellow-700">
                  <p>Name: {possessedUser?.full_name}</p>
                  <p>Email: {possessedUser?.email}</p>
                </div>
              </>
            ) : (
              <div>
                <p className="text-base sm:text-lg font-medium text-yellow-800">
                  Waiting...
                </p>
                {possessedUserLoading || possessedEntityLoading ? (
                  <Loading
                    className="w-6 h-6 my-3 !text-yellow-700"
                    containerClass="!justify-start"
                  />
                ) : (
                  <p className="text-sm sm:text-base font-medium text-yellow-700">
                    Please input user email below to load their borrower
                    dashboard...
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Formik
        initialValues={{ email: null }}
        validate={async (values) => {
          const errors: FormErrors = {};

          if (!values.email) {
            errors.email = '* Please provide a valid email';
          }
          return errors;
        }}
        onSubmit={async (values) => {
          loginAsUser(values.email);
        }}
      >
        {({ errors, setFieldValue, setFieldError }) => (
          <Form className="w-full my-3 flex flex-col lg:flex-row lg:justify-between items-start">
            <div className="flex flex-col gap-1 w-full lg:w-auto lg:min-w-md">
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <FontAwesomeIcon
                    aria-hidden="true"
                    icon={faEnvelope}
                    className="text-gray-200"
                  />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={searchedEmail || entityEmail || ''}
                  placeholder="Borrower User Email"
                  className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 text-sm sm:text-base sm:leading-6"
                  onChange={(e) => {
                    handleChange(e);
                    setFieldValue('email', e.target.value);
                    setFieldError('email', '');
                  }}
                  disabled={possessedEntityLoading}
                />
              </div>
              <div className="min-h-4">
                {errors?.email && (
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-error text-xxs sm:text-xs text-left"
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col xs:flex-row xs:items-start gap-2 w-full sm:w-auto">
              <PrimaryButton
                ariaLabel="save-default-terms-button"
                buttonText="View User Dashboard"
                buttonColor="bg-primary-blue w-full sm:w-auto sm:min-w-max !px-6 !my-0"
                hoverClass="hover:bg-primary-blue-hover"
                disabled={possessedEntityLoading}
                isLoading={possessedEntityLoading}
              />
              <OutlineButton
                ariaLabel="clear-possessed-user"
                buttonText="Clear"
                buttonColor="border-primary-blue text-primary-blue w-full sm:w-auto sm:min-w-max !px-6 !my-0"
                hoverClass=" hover:text-primary-blue-hover hover:border-primary-blue-hover"
                onClick={clearUser}
                disabled={possessedEntityLoading || !possessedEntity}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

PossessUser.role = 'possess-user-component';
