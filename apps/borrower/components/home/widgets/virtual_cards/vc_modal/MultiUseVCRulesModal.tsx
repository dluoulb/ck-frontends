import React, { useState } from 'react';

import OutlineButton from '@components/buttons/OutlineButton';
import PrimaryButton from '@components/buttons/PrimaryButton';
import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import { createVirtualCard } from '@lib/actions/companies';
import FullStory from '@lib/utils/fullstory';

export default function MultiUseVCRulesModal({ next, toggleModal, hasDefaultTerm = false }) {
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const { entity, fetchEntity } = useEntity();
  const { user } = useUser();
  const api = useApi();
  const { makeToast } = useToast();

  const skipAgreementAndTerms = !!entity?.is_bank_connected && hasDefaultTerm;

  const handleClick = async () => {
    const fullstory = new FullStory();
    fullstory.agreeVcRulesEvent(user?.id, entity?.id);

    if (skipAgreementAndTerms) {
      setLoading(true);
      try {
        await createVirtualCard(api, entity?.id);
        makeToast('Credit Key Card Successfully Created', 'success');
        fetchEntity({ company_id: entity?.id });
        next();
      } catch (error) {
        makeToast('Failed to create Credit Key Card. Please contact Credit Key Support', 'error');
      } finally {
        setLoading(false);
      }
    } else {
      next();
    }
  };

  return (
    <div role={MultiUseVCRulesModal.role}>
      <section>
        <div className="my-2 space-y-4 border rounded-md border-gray-300 p-4">
          <p className="text-center text-2xl font-bold tracking-wider">Credit Key Card Usage</p>
          <div>
            <p>Use of Credit Key Cards are for commercial loan purposes only.</p>
            <ul role="list" className="list-disc text-left space-y-1 pl-3 my-3">
              <li>Credit Key Cards are not to be used for personal, family, or household use.</li>
              <li>
                Processing Credit Key Cards through your merchant account is strictly prohibited.
              </li>
            </ul>
            <p>
              Transactions found to be in violation will result in Credit Key Card access being
              revoked and potential suspension of your Credit Key account.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <label>
            <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
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
            onClick={handleClick}
            disabled={!agree || loading}
            isLoading={loading}
          />
        </div>
      </section>
    </div>
  );
}

MultiUseVCRulesModal.role = 'multi-use-vc-rules-modal-component';
