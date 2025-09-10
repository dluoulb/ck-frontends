import React from 'react';
import { faCog, faQuestionCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useModal from '@hooks/useModal';
import CompanyVirtualCardRecord from '@lib/records/company_virtual_card';
import { formatCardNumber } from '@lib/utils/formatters';
import ActiveVirtualCard from './ActiveVirtualCard';
import CardFinancialInfo from './CardFinancialInfo';
import HowToUseModal from './HowToUseModal';
import ManageCardModal from './ManageCardModal';

interface ActiveCardSectionProps {
  virtualCard: CompanyVirtualCardRecord;
}

export default function ActiveCardSection({
  virtualCard,
}: ActiveCardSectionProps) {
  const {
    isModalActive: isHowToUseModalActive,
    toggleModal: toggleHowToUseModal,
  } = useModal();

  const { isModalActive: isManageModalActive, toggleModal: toggleManageModal } =
    useModal();

  return (
    <>
      <div className="max-w-lg">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm py-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-lg font-bold text-gray-900">
                Credit Key Virtual Card
              </h3>
              <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-lg">
                Active
              </span>
            </div>

            <ActiveVirtualCard
              cardNumber={formatCardNumber(virtualCard?.last_four)}
            />

            <CardFinancialInfo />

            <div className="flex items-center px-6 pt-2 max-w-lg mx-auto">
              <button
                onClick={toggleManageModal}
                className="text-primary-blue hover:text-primary-blue-hover text-base font-semibold flex items-center gap-2 flex-1 justify-center"
              >
                <FontAwesomeIcon icon={faCog} className="text-sm" />
                Manage
              </button>
              <button
                onClick={toggleHowToUseModal}
                className="text-primary-blue hover:text-primary-blue-hover text-base font-semibold flex items-center gap-2 flex-1 justify-center"
              >
                <FontAwesomeIcon icon={faQuestionCircle} className="text-sm" />
                How to Use
              </button>
            </div>
          </div>
        </div>
      </div>

      <HowToUseModal
        isModalActive={isHowToUseModalActive}
        toggleModal={toggleHowToUseModal}
      />

      <ManageCardModal
        isModalActive={isManageModalActive}
        toggleModal={toggleManageModal}
      />
    </>
  );
}
