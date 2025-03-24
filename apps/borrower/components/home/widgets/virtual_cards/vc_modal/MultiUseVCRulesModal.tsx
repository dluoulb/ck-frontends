import React, { useState } from 'react';

import PrimaryButton from '@components/buttons/PrimaryButton';
import OutlineButton from '@components/buttons/OutlineButton';

export default function MultiUseVCRulesModal({ next, toggleModal }) {
  const [agree, setAgree] = useState(false);

  return (
    <div role={MultiUseVCRulesModal.role}>
      <section>
        <div className="my-2 space-y-4 border rounded-md border-gray-300 p-4">
          <p className="text-center text-2xl font-bold tracking-wider">
            Virtual Card Usage
          </p>
          <div>
            <p>Use of virtual cards are for commercial loan purposes only.</p>
            <ul role="list" className="list-disc text-left space-y-1 pl-3 my-3">
              <li>
                Virtual cards are not to be used for personal, family, or
                household use.
              </li>
              <li>
                Processing virtual cards through your merchant account is
                strictly prohibited.
              </li>
            </ul>
            <p>
              Transactions found to be in violation will result in virtual card
              access being revoked and potential suspension of your Credit Key
              account.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <label>
            <input
              type="checkbox"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />
            <span className="text-base text-primary-blue-hover ml-2">
              I have read and agree to the terms and conditions
            </span>
          </label>
        </div>
        <div className="content flex justify-end mt-8">
          <OutlineButton
            ariaLabel="do-not-agree-to-virtual-card-terms-button"
            buttonText="Cancel"
            buttonColor="bg-white"
            hoverClass="hover:bg-gray-300"
            containerClass="w-max mr-2"
            onClick={toggleModal}
          />
          <PrimaryButton
            ariaLabel="agree-to-virtual-card-terms-button"
            buttonText="Agree"
            buttonColor="bg-primary-blue"
            hoverClass="hover:bg-primary-blue-hover"
            containerClass="w-max"
            onClick={next}
            disabled={!agree}
          />
        </div>
      </section>
    </div>
  );
}

MultiUseVCRulesModal.role = 'multi-use-vc-rules-modal-component';

