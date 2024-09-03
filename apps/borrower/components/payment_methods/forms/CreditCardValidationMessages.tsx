import React from 'react';

export default function CreditCardValidationMessages({ cardErrors }) {
  let msg;

  const getMsg = () => {
    if (!cardErrors) return null;
    let error =
      Object.prototype.toString.call(cardErrors) === '[object Array]'
        ? cardErrors[0]
        : cardErrors;

    switch (error) {
      case 'Card Number Required':
      case 'Invalid Card Length':
        msg = 'Please provide a valid 14-16 digit credit card number.';
        break;
      case 'Invalid Card Number':
        msg = 'Unable to verify card number. Please try again.';
        break;
      case 'Invalid CVV2':
      case 'CVV2 Required':
        msg = 'Unable to verify CVV. Please try again.';
        break;
      case 'Invalid Zip':
      case 'Zip is required':
        msg = 'Please provide a valid 5 digit zip code.';
        break;
      case 'Expiration is required':
      case 'Expiration must be in the future':
        msg = 'Please provide a valid expiration date.';
        break;
    }
    return msg;
  };

  return (
    <div className="text-negative-red text-center mb-2 font-avenir-medium">
      {getMsg()}
    </div>
  );
}
