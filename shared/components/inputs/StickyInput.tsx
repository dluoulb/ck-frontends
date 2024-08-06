import React from 'react';
import classNames from 'classnames';
import { ErrorMessage } from 'formik';

import useInputs from '@hooks/useInputs';
import { formStyles } from '@lib/constants/SiteVariables';
import Input from './Input';

export default function StickyInput(props) {
  const { id, placeholder } = props;
  if (!id || !placeholder) throw 'Missing required props';

  const { multi, hasFieldError, hasColumnError, fieldErrMsg, fieldComplete } =
    useInputs(props);

  return (
    <div className="form-floating flex flex-col items-start relative outline-none">
      <Input {...props} />
      <label
        htmlFor={id}
        className={classNames(
          'absolute text-xs sm:text-sm transition-all duration-300 origin-left left-3.5 top-1/2 transform -translate-y-1/2 peer-focus:-translate-y-4 sm:peer-focus:-translate-y-5 peer-focus:text-primary-blue peer-focus:scale-75 peer-focus:left-3.5',
          { 'top-[35%] -translate-y-[35%]': hasColumnError },
          { '!top-[45%] sm:!top-[35%]': !hasFieldError && hasColumnError },
          fieldComplete
            ? 'text-tertiary-gray scale-75 -translate-y-4 sm:-translate-y-5 peer-focus:left-3.5'
            : 'text-secondary-gray'
        )}
      >
        {placeholder}
      </label>
      {multi && hasColumnError ? (
        <div
          className={classNames(
            'sm:h-5',
            formStyles.validation,
            hasFieldError ? 'my-0.5 sm:h-4' : 'h-0'
          )}
        >
          {hasFieldError && fieldErrMsg}
        </div>
      ) : (
        <ErrorMessage
          name={id}
          component="div"
          className={classNames(
            'sm:h-5',
            formStyles.validation,
            hasFieldError ? 'my-0.5 h-4' : 'h-0'
          )}
        />
      )}
    </div>
  );
}
