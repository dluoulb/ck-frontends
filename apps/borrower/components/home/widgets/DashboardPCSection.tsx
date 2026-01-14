import React from 'react';
import { faQuestionCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useModal from '@hooks/useModal';
import { physicalCardBenefitsConfig } from '@lib/constants/SiteVariables';
import ActivationBenefits from '../../wallet/ActivationBenefits';
import HowToUseModal from '../../wallet/physical_card/HowToUseModal';
import InactivePhysicalCard from '../../wallet/physical_card/InactivePhysicalCard';

export default function DashboardPCSection() {
  const { isModalActive, toggleModal } = useModal();

  return (
    <>
      <div className="space-y-4">
        <div className="bg-[#fff7ec] shadow-sm p-6 border rounded-md">
          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 rounded-2xl bg-white border max-w-lg mx-auto py-2">
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
