import React from 'react';

export default function ApplePayInstructions() {
  return (
    <div>
      <ol className="mt-2 ml-4 list-decimal">
        <li>
          Click <b>"Add Debit/Credit Card"</b>
        </li>
        <li>
          Click <b>"Enter Card Details Manually"</b>
        </li>
        <li>
          Enter in your <b>name</b> and <b>card number</b>
        </li>
        <li>
          Enter in the <b>CVV</b> and <b>expiration date</b>
        </li>
        <li>
          Card will be added and the terms and conditions will present themselves. Click{' '}
          <b>"Accept"</b>
        </li>
        <li>If card needs to be verified, then the steps to verify will be presented</li>
        <li>Card added to wallet</li>
      </ol>
    </div>
  );
}
