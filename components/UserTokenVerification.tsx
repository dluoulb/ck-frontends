import React, { useEffect, useState } from 'react';
import Loading from './Loading';
import VerificationInput from "react-verification-input";

export default function UserTokenVerification({ onSubmit }) {
  const isLoading = false;
  const [token, setToken] = useState('');

  useEffect(() => {
    if (token.length === 6) {
      submitToken(token);
    }
  }, [token]);

  const submitToken = async (givenToken) => {
    onSubmit(givenToken);
    setToken('');
  };

  const verificationInputChanged = (value) => {
    setToken(value);
  };

  if (isLoading) return <Loading containerClass="p-20 xs:p-40" />;

  return (
    <div role="form">
      <VerificationInput
        autoFocus={true}
        length={6}
        onChange={verificationInputChanged}
        placeholder="-"
        validChars="0-9"
        value={token}
        inputProps={{ autoComplete: 'one-time-code', type: 'tel' }}
          classNames={{
            container: 'w-full sm:pr-12 tokens flex justify-center items-center h-12 sm:h-14',
            character:
              'input py-2 sm:py-4 sm:px-2 mobile:px-5 text-base font-semibold mobile:text-lg border border-tertiary-gray rounded-lg sm:mx-1 flex justify-center items-center cursor-pointer',
            characterInactive: 'text-tertiary-gray bg-white',
            characterSelected: 'border-primary-blue border-1',
          }}
      />
    </div>
  );
}
