import React, { useState } from 'react';
import PrimaryButton from '@components/buttons/PrimaryButton';
import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import FullStory from '@lib/utils/fullstory';
import useToast from '@hooks/useToast';
import { createPhysicalCard } from '@lib/actions/companies';
import useApi from '@hooks/useApi';

export default function ConfirmMailingAddressModal({ next }) {
  const api = useApi();
  const { entity } = useEntity();
  const { user } = useUser();
  const { makeToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    const fullstory = new FullStory();
    fullstory.confirmMailingAddressEvent(user?.id, entity?.id);

    createPhysicalCard(api, entity?.id)
    .then(() => {
      makeToast('Credit Key Card Successfully Requested', 'success');
      next();
    })
    .catch(() => {
      makeToast('Failed to request Credit Key Card. Please contact Credit Key Support', 'error');
      setLoading(false);
    });
  };

  return (
    <div role={ConfirmMailingAddressModal.role}>
      <section>
        <div className="my-2 space-y-4">
          <p className="text-2xl font-bold tracking-wider">
            Confirm mailing address
          </p>
          <div>
            <p>
              Please confirm the address where you'd like us to mail your Credit Key physical card.
            </p>
          </div>
          <div className="flex flex-col xs:flex-row justify-start border rounded-xl border-gray-300">
            <div className="p-3">
              <p>{user.first_name} {user.last_name}</p>
              <p>{entity.address?.address1}</p>
              {entity.address?.address2 && <p>{entity.address.address2}</p>}
              <p>{entity.address?.city}, {entity.address?.state} {entity.address?.zip?.substring(0,5)}</p>
            </div>
            <div className="p-3 flex-1 flex justify-end items-center">
              <a className="font-semibold text-primary-blue" href="#">Contact us to edit</a>
            </div>
          </div>
        </div>
        <div className="content flex mt-8">
          <PrimaryButton
            ariaLabel="mail-credit-key-physical-card-button"
            buttonText="Mail Credit Key Physical Card"
            buttonColor="bg-primary-blue"
            hoverClass="hover:bg-primary-blue-hover"
            containerClass="w-full"
            onClick={handleConfirm}
            loading={loading}
          />
        </div>
      </section>
    </div>
  );
}

ConfirmMailingAddressModal.role = 'confirm-mailing-address-modal-component';


