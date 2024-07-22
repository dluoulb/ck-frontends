import React from 'react';
import { useRouter } from 'next/router';
import { faSquare } from '@fortawesome/free-solid-svg-icons';
import { faHandWave } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Support from '@components/Support';
import UserVerification from '@components/UserVerification';
import { useAuth } from 'hooks/useAuth';

export default function Login() {
  const router = useRouter();
  const { verify, loading, setLoading } = useAuth();

  const save = (values, input_type) => {
    setLoading(true);
    verify
      .mutateAsync({
        contact: values,
        type: input_type,
        ui: router?.query?.from || '',
      })
      .then(() =>
        router.push(
          `/login-token?input_type=${input_type}&contact=${values.contact}&from=${router?.query?.from || ''}`
        )
      )
      .finally(() => setLoading(false));
  };

  return (
    <div role="main" className="mx-4 sm:mx-auto my-6 sm:my-12">
      <div className="mx-auto max-w-xl w-full overflow-y-scroll">
        <div className="my-4 flex items-center">
          <span className="fa-layers fa-fw text-5xl">
            <FontAwesomeIcon
              icon={faSquare}
              className="text-secondary-blue !mx-0"
            />
            <FontAwesomeIcon
              icon={faHandWave}
              className="text-primary-blue text-3xl !mx-1.5"
            />
          </span>
          <div className="text-xl sm:text-4xl font-extrabold">
            Welcome to Credit Key
          </div>
        </div>
        <div className="font-light sm:text-lg tracking-wide mb-6">
          <div>
            <p>Please sign in. We'll send a 6-digit code to you.</p>
          </div>
        </div>
        <UserVerification
          defaultValue=""
          buttonText="Sign in"
          onSubmit={save}
          loading={loading}
        />
        <div className="mt-6 sm:mt-12">
          <Support />
        </div>
      </div>
    </div>
  );
}
