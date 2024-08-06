import React from 'react';
import { useField } from 'formik';
import { IMaskInput } from 'react-imask';

const MaskedField = (props) => {
  const [field, meta, helpers] = useField(props.name);
  const { touched, ...rest } = props;

  return (
    <IMaskInput
      {...field}
      {...rest}
      {...(touched !== undefined ? { touched: touched.toString() } : {})}
      onAccept={(value, mask) => helpers.setValue(value)}
      onComplete={(value, mask) => helpers.setValue(value)}
      unmask={false}
      definitions={{ '9': /\d/ }}
    />
  );
};

export default MaskedField;