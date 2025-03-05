import React from 'react';
import useModal from '@hooks/useModal';
import { VCModalWrapper } from './vc_modal';
import Notification from '@components/Notification';
import PrimaryButton from '@components/buttons/PrimaryButton';
import { faPartyHorn } from '@fortawesome/pro-solid-svg-icons';
import { useEntity } from '@contexts/EntityContext';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { restrictedVcPurchasesLink } from '@lib/constants/SiteVariables';

export default function SingleUseVirtualCardCTABanner() {
  const { entity } = useEntity();
  const activeBanner = entity?.cta_banners?.find((b) => b.enabled);
  const singleUseVcEnabled = activeBanner?.name === 'virtual_card';
  const { isModalActive, toggleModal } = useModal();
  const { orders, ordersError, ordersLoading } = useBorrowerDeps();
  const virtualCardOrders = orders?.filter(
    (o) => o?.transaction_type === 'virtual_card' && !!o?.virtual_card_details
  );

  return (
    <>
      {singleUseVcEnabled && !ordersLoading && (!virtualCardOrders?.length || ordersError) &&
        <div className="mt-4">
          <Notification
            icon={faPartyHorn}
            headline="Big news! Meet Virtual Card"
            message={
              <div className="space-y-1">
                <p>You can now use Credit Key to pay for any business purchase, anywhere!*</p>
                <p>If the merchant you’re shopping with doesn’t offer Credit Key as a payment option, you can add funds from your existing line of credit onto a virtual card and use that card to complete your purchase.</p>
                <ul className="list-disc ml-5 !my-5">
                  <li>Use your existing line of credit for eligible purchases at any vendor</li>
                  <li>Enjoy Net 30 and up to 12 month repayment terms</li>
                  <li>No setup costs or any additional fees—just the convenience of paying your way</li>
                  <li>Make your purchase online or manually add your card to your digital wallet for seamless in-store payments</li>
                </ul>
                <p>Get started today</p>
              </div>
            }
            ctaButton={
              <PrimaryButton 
                ariaLabel="create-virtual-card-button"
                buttonText="Create a virtual card"
                buttonColor="bg-primary-blue"
                hoverClass="hover:bg-primary-blue-hover"
                onClick={toggleModal}
              />
            }
            buttonClass="border-0"
            footer={
              <p className="text-sm text-black">
                *Virtual cards can only be used for business expenses. Learn about restricted purchases
                <a 
                  href={restrictedVcPurchasesLink} 
                  target="_blank"
                  className="ml-1 cursor-pointer hover:text-primary-blue-hover border-b border-transparent hover:border-primary-blue-hover font-medium text-primary-blue-hover"
                >
                  here
                </a>
              </p>
            }
          />
        </div>
      }
      <VCModalWrapper isModalActive={isModalActive} toggleModal={toggleModal} />
    </>
  );
}


