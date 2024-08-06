import React from 'react';
import classNames from 'classnames';

import useInputs from '@hooks/useInputs';
import { formStyles } from '@lib/constants/SiteVariables';
import MaskedField from './MaskedField';

export default function Input(props) {
  const { id, disclaimer } = props;
  const { hasFieldError, hasColumnError } = useInputs(props);

  return (
    <>
      <MaskedField
        {...props}
        name={id}
        className={classNames(
          'peer w-full text-xs sm:text-sm px-3.5 pt-4 sm:pt-5 pb-1 block mt-0 bg-transparent border border-solid border-primary-border-gray rounded-lg appearance-none focus:outline-none focus:ring-0',
          formStyles.error(hasFieldError)
        )}
        id={id}
        placeholder=" "
      />
      {disclaimer && (
        <div
          className={classNames(
            'z-40 absolute top-1/2 transform -translate-y-1/2 right-0 pr-3 flex items-center',
            { 'top-[35%]': hasColumnError }
          )}
        >
          {disclaimer}
        </div>
      )}
    </>
  );
}
