import React from 'react';
import classNames from 'classnames';
import { ErrorMessage, Field } from 'formik';

import useInputs from '@hooks/useInputs';
import { formStyles } from '@lib/constants/SiteVariables';

export default function StickySelect(props) {
  const { id, options, disclaimer, placeholder, shortOptionsDisplay } = props;

  const { multi, hasFieldError, hasColumnError, fieldErrMsg, fieldComplete } = useInputs(props);

  return (
    <div className="select">
      <div className="form-floating flex flex-col outline relative">
        <Field
          as="select"
          className={classNames(
            'peer w-full text-xs sm:text-sm px-3.5 pt-4 sm:pt-5 pb-1 block mt-0 bg-transparent border border-solid border-primary-gray-border rounded-lg appearance-none focus:outline-none focus:ring-0',
            formStyles.error(hasFieldError),
          )}
          children={options.map((o) => (
            <option key={o[1]} value={o[1]}>
              {shortOptionsDisplay ? o[1] : o[0]}
            </option>
          ))}
          id={id}
          name={id || ''}
        />
        <label
          className={classNames(
            'absolute text-xs sm:text-sm transition-all duration-300 origin-left left-3.5 top-1/2 transform -translate-y-1/2 peer-focus:-translate-y-4 sm:peer-focus:-translate-y-5 peer-focus:text-primary-blue peer-focus:scale-75 peer-focus:left-3.5',
            { 'top-[35%] -translate-y-[35%] ': hasColumnError },
            { '!top-[45%] sm:!top-[35%]': !hasFieldError && hasColumnError },
            fieldComplete
              ? 'text-tertiary-gray scale-75 -translate-y-4 sm:-translate-y-5 peer-focus:left-3.5'
              : 'text-secondary-gray',
          )}
          htmlFor={id}
        >
          {placeholder}
        </label>
        {disclaimer && disclaimer}
        {multi && hasColumnError ? (
          <div
            className={classNames('sm:h-5', formStyles.validation, hasFieldError ? 'h-4' : 'h-0')}
          >
            {hasFieldError && fieldErrMsg}
          </div>
        ) : (
          <ErrorMessage
            name={id}
            component="div"
            className={classNames('sm:h-5', formStyles.validation, hasFieldError ? 'h-4' : 'h-0')}
          />
        )}
      </div>
    </div>
  );
}
