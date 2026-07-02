import React, { useEffect, useState } from 'react';
import { faQuestionCircle, faXmark } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useModal from '@hooks/useModal';
import { physicalCardBenefitsConfig } from '@lib/constants/SiteVariables';
import { getCookie, setCookie } from '@lib/utils/cookies';
import ActivationBenefits from '../../wallet/ActivationBenefits';
import HowToUseModal from '../../wallet/physical_card/HowToUseModal';
import InactivePhysicalCard from '../../wallet/physical_card/InactivePhysicalCard';

const HIDE_PHYSICAL_CARD_UPSELL_COOKIE = 'hide_physical_card_upsell';
const COOKIE_EXPIRY_DAYS = 30;

export default function DashboardPCSection() {
  const { isModalActive, toggleModal } = useModal();
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    if (!getCookie(HIDE_PHYSICAL_CARD_UPSELL_COOKIE)) {
      setIsDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setCookie(HIDE_PHYSICAL_CARD_UPSELL_COOKIE, 'true', COOKIE_EXPIRY_DAYS);
    setIsDismissed(true);
  };

  if (isDismissed) return null;

  return (
    <>
      <div className="space-y-4">
        <div className="relative bg-[#fff7ec] shadow-sm p-6 border border-border-gray rounded-md">
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss physical card upsell"
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <FontAwesomeIcon icon={faXmark} className="text-lg" />
          </button>
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 rounded-2xl bg-white border border-gray-200 max-w-lg mx-auto py-2">
              <div className="space-y-2 flex flex-col items-center">
                <div className="flex items-center justify-between w-full px-4">
                  <h3 className="text-lg font-bold text-gray-900">Credit Key Physical Card</h3>
                  <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg">
                    Inactive
                  </span>
                </div>

                <InactivePhysicalCard cardTitle={'Credit Key Physical Card'} />

                <button
                  onClick={toggleModal}
                  className="w-full max-w-lg text-bas pb-1 font-semibold text-primary-blue hover:text-primary-blue-hover flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faQuestionCircle} className="text-sm" />
                  How to Use
                </button>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <ActivationBenefits
                title={physicalCardBenefitsConfig.title ?? ''}
                description={physicalCardBenefitsConfig.description ?? ''}
                benefits={physicalCardBenefitsConfig.benefits ?? []}
                bgColor="fff7ec"
              />
            </div>
          </div>
        </div>
      </div>

      <HowToUseModal isModalActive={isModalActive} toggleModal={toggleModal} />
    </>
  );
}
