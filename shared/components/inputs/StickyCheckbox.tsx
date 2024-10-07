import React, { useState } from 'react';
import classNames from 'classnames';
import { ErrorMessage, Field } from 'formik';

import { formStyles } from '../../lib/constants/SiteVariables';

export default function StickyCheckbox({
  id,
  errors,
  placeholder,
  setFieldValue,
}) {
  let [checked, setChecked] = useState(false);

  const toggleChecked = () => {
    setChecked(!checked);
  };

  return (
    <div className="relative flex items-start gap-2">
      <Field
        id={id}
        name={id}
        type="checkbox"
        aria-describedby={id}
        className={classNames(
          'h-4 w-4 rounded-md border-gray-300 text-primary-blue focus:ring-primary-blue mt-1.5',
          {
            '!border-error': errors[id],
          }
        )}
        onChange={(e) => {
          setFieldValue(id, e.currentTarget.checked);
          toggleChecked();
        }}
      />
      <div className="text-sm">
        <label htmlFor={id} className="text-sm sm:text-base">
          <span className="text-sm">{placeholder}</span>
          <ErrorMessage
            name={id}
            component="div"
            className={formStyles.validation}
          />
        </label>
      </div>
    </div>
  );
}
