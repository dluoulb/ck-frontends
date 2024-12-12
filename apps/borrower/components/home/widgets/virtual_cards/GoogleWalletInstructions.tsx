import React from 'react';

export default function GoogleWalletInstructions() {
  return (
    <div>
      <ol className="mt-2 ml-4 list-decimal">
        <li>Click <b>"Add to wallet"</b></li>
        <li>Click <b>"Payment Card"</b></li>
        <li>Click <b>"New credit or debit"</b></li>
        <li>Click <b>"Enter details manually"</b></li>
        <li>Enter in <b>card number</b>, <b>expiration date</b>, <b>CVV</b>, and <b>address details</b></li>
        <li>Click <b>"save and continue"</b></li>
        <li>If card needs to be verified, then the steps to verify will be presented</li>
        <li>Card added to wallet</li>
      </ol>
    </div>
  );
}


