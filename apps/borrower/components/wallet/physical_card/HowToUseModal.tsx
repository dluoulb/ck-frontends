import React from 'react';

import ModalWrapper from '@components/modals/ModalWrapper';

interface HowToUseModalProps {
  isModalActive: boolean;
  toggleModal: () => void;
}

export default function HowToUseModal({
  isModalActive,
  toggleModal,
}: HowToUseModalProps) {
  return (
    <ModalWrapper isModalActive={isModalActive} toggleModal={toggleModal}>
      <h2 className="font-bold text-xl">Credit Key Physical Card</h2>
      <div className="mt-4">
        <h3 className="text-base font-bold text-gray-900">
          Carry flexible purchasing power wherever your business needs it
        </h3>
        <ol className="space-y-1 list-decimal list-outside pl-4 mt-1">
          <li className="text-sm text-gray-700">
            Mail your free card – We’ll send your Credit Key physical card at no
            cost.
          </li>
          <li className="text-sm text-gray-700">
            Shop anywhere Mastercard® Prepaid Debit is accepted – Use it
            in-store, over the phone, or at your trusted suppliers across the
            U.S.
          </li>
          <li className="text-sm text-gray-700">
            Pay on your terms – Repay over time with your Credit Key plan and
            build business credit with every on-time payment.
          </li>
        </ol>
      </div>
    </ModalWrapper>
  );
}
