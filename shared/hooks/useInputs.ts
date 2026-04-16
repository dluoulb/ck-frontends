function useInputs(props) {
  const { id, multi, values, error, touched } = props;

  function checkErrorsAndTouched(error, touched) {
    if (
      Object.values(error).every((value) => value === undefined) ||
      Object.values(touched).includes(false)
    )
      return false;

    for (const key of Object.keys(error)) {
      if (error[key] !== undefined && touched[key] === true) {
        return true;
      }
    }
    return false;
  }

  const nestedField = id?.includes('.') && id?.split('.');
  const fieldName = nestedField ? id?.split('.')[1] : id;
  const fieldErrMsg = error && error[fieldName];
  const multiColumnError = error && touched && checkErrorsAndTouched(error, touched);

  const hasFieldError = multi ? touched[fieldName] && error[fieldName] : touched && error;

  const hasColumnError = multi ? multiColumnError : touched && error;

  const fieldValue = values
    ? nestedField
      ? values[nestedField[0]]?.[nestedField[1]]
      : values[id]
    : null;
  const fieldComplete = fieldValue === '' || fieldValue == null ? null : fieldValue;

  return {
    fieldName,
    fieldComplete,
    fieldErrMsg,
    hasColumnError,
    hasFieldError,
    multi,
  };
}

export default useInputs;
