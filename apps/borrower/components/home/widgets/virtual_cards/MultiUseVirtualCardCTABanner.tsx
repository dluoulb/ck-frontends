import React, { useEffect, useState } from 'react';
import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import useModal from '@hooks/useModal';
import MultiUseVirtualCardModalWrapper from './vc_modal/MultiUseVirtualCardModalWrapper';
import Notification from '@components/Notification';
import PrimaryButton from '@components/buttons/PrimaryButton';
import { faPartyHorn } from '@fortawesome/pro-solid-svg-icons';
import { useEntity } from '@contexts/EntityContext';

export default function MultiUseVirtualCardCTABanner() {
  const { entity } = useEntity();
  const vcProps = useCompanyVirtualCard();
  const activeBanner = entity?.cta_banners?.find((b) => b.enabled);
  const multiUseVcEnabled = activeBanner?.name === 'multi_use_virtual_card';
  const { isModalActive, toggleModal } = useModal();
  const [vcCtaDisplayedOn, setVcCtaDisplayedOn] = useState(
    Number(localStorage.getItem('vcCtaDisplayedOn'))
  );
  const oneDay = 1000*60*60*24;
  const displayCtaExpired = () => {
    return (vcCtaDisplayedOn && Date.now() > (vcCtaDisplayedOn + oneDay));
  }

  useEffect(() => {
    if (!multiUseVcEnabled) return;
    if (vcProps.virtualCardLoading) return;
    if (vcProps.virtualCard) return;
    if (vcCtaDisplayedOn) return;
    const now = Date.now();
    setVcCtaDisplayedOn(now);
    localStorage.setItem('vcCtaDisplayedOn', String(now));
  }, [vcProps, multiUseVcEnabled]);

  return (
    <>
      {multiUseVcEnabled && !displayCtaExpired() && !vcProps.virtualCardLoading && !vcProps.virtualCard &&
        <div className="mt-4">
          <Notification
            icon={faPartyHorn}
            headline="A multi-use prepaid card with your Credit Key line of credit ready to be loaded for all of your purchasing needs"
            message={
              <div className="space-y-1">
                <p>With the new card functionality, you can:</p>
                <ul className="list-disc ml-5">
                  <li>Use the same card over and over, streamlining your purchasing process</li>
                  <li>Seamlessly add the card to your digital wallet (Apple or Google Pay) for a fast, secure way to pay in-store and online</li>
                  <li>Continue to enjoy the ability to use your Credit Key line of credit at vendors who don't yet offer us as a payment method directly</li>
                </ul>
              </div>
            }
            ctaButton={
              <PrimaryButton 
                ariaLabel="create multi-use virtual card"
                buttonText="Create my card today"
                buttonColor="bg-primary-blue"
                hoverClass="hover:bg-primary-blue-hover"
                onClick={toggleModal}
              />
            }
            buttonClass="border-0"
          />
        </div>
      }
      <MultiUseVirtualCardModalWrapper isModalActive={isModalActive} toggleModal={toggleModal} />
    </>
  );
}

