import { useEffect, useState } from 'react';

function useInputs(props) {
  const [fieldComplete, setFieldComplete] = useState();
  const { id, multi, values, error, touched } = props;

  function checkErrorsAndTouched(error, touched) {
    if (
      Object.values(error).every((value) => value === undefined) ||
      Object.values(touched).includes(false)
    )
      return false;

    for (let key in error) {
      if (error[key] !== undefined && touched[key] === true) {
        return true;
      }
    }
    return false;
  }

  const nestedField = id?.includes('.') && id?.split('.');
  const fieldName = nestedField ? id?.split('.')[1] : id;
  const fieldErrMsg = error && error[fieldName];
  const multiColumnError =
    error && touched && checkErrorsAndTouched(error, touched);

  const hasFieldError = multi
    ? touched[fieldName] && error[fieldName]
    : touched && error;

  const hasColumnError =
    multi || multi === 'true' ? multiColumnError : touched && error;

  useEffect(() => {
    if (values) {
      setFieldComplete(
        nestedField ? values[nestedField[0]][nestedField[1]] : values[id],
      );
    }
  }, [id, values, nestedField]);

  return {
    fieldName,
    fieldComplete,
    fieldErrMsg,
    hasColumnError,
    hasFieldError,
    multi: multi === 'true',
  };
}

export default useInputs;
