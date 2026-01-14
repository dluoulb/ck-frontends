import React from 'react';

import PrimaryButton from '@components/buttons/PrimaryButton';

export default function VCRulesModal({ next }) {
  return (
    <div role={VCRulesModal.role}>
      <section>
        <div className="my-2 space-y-4">
          <p className="text-center text-2xl font-bold tracking-wider">Virtual Card Usage</p>
          <div>
            <p>Use of virtual cards are for commercial loan purposes only.</p>
            <ul role="list" className="list-disc text-left space-y-1 pl-3 my-3">
              <li>Virtual cards are not to be used for personal, family, or household use.</li>
              <li>
                Processing virtual cards through your merchant account is strictly prohibited.
              </li>
            </ul>
            <p>
              Transactions found to be in violation will result in virtual card access being revoked
              and potential suspension of your Credit Key account.
            </p>
          </div>
        </div>
        <div className="content flex flex-col gap-2 items-center mt-8">
          <PrimaryButton
            ariaLabel="understand-virtual-card-rules-button"
            buttonText="I Understand"
            buttonColor="bg-primary-blue"
            hoverClass="hover:bg-primary-blue-hover"
            onClick={next}
          />
          <div
            onClick={() => {
              localStorage.setItem('hide_vc_notice', JSON.stringify(true));
              next();
            }}
            className="text-secondary-gray text-sm cursor-pointer border-b border-transparent hover:border-secondary-gray max-w-max"
          >
            <p>Do Not Show Again</p>
          </div>
        </div>
      </section>
    </div>
  );
}

VCRulesModal.role = 'vc-rules-modal-component';
