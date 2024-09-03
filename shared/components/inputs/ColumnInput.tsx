import React from 'react';
import classNames from 'classnames';

import useInputs from '@hooks/useInputs';
import { formStyles } from '@lib/constants/SiteVariables';

export default function ColumnInput({
  children,
  error,
  touched = undefined,
  className = '',
}) {
  const columnClass = 'flex flex-col justify-center';
  const multi = Array.isArray(children);
  const { hasColumnError } = useInputs({ multi, children, error, touched });

  return (
    <div
      className={classNames(formStyles.input(multi, hasColumnError), className)}
    >
      {multi ? (
        children.map((c, key) => (
          <div
            key={key}
            className={
              c.props.className
                ? columnClass + ' ' + c.props.className
                : columnClass
            }
          >
            {c.props.error
              ? c
              : React.cloneElement(c, {
                  error,
                  multi,
                  touched,
                })}
          </div>
        ))
      ) : (
        <div className="w-full">
          {React.cloneElement(children, { error, touched })}
        </div>
      )}
    </div>
  );
}
