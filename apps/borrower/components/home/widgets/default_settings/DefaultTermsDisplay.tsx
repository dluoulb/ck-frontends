import React, { useState } from 'react';
import { faEdit } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useEntity } from '@contexts/EntityContext';
import useApi from '@hooks/useApi';
import useModal from '@hooks/useModal';
import useToast from '@hooks/useToast';
import { updateRechargeTerm } from '@lib/actions/companies';
import { getTermDisplay } from '@lib/utils/formatters';
import DefaultTermSettingsModal from './DefaultTermsModal';

export default function DefaultTermsDisplay() {
  const api = useApi();
  const { makeToast } = useToast();
  const { entity, fetchEntity } = useEntity();
  const { defaultTermSettings = [] } = useBorrowerDeps();

  const [loading, setLoading] = useState(false);
  const { toggleModal, isModalActive, modalState, setModalState } = useModal(
    defaultTermSettings[0]
  );

  const onSave = (merchant_id, term) => {
    setLoading(true);
    updateRechargeTerm(api, entity, merchant_id, term?.term)
      .then(() => {
        fetchEntity({ company_id: entity?.id });
        toggleModal();
        makeToast('Recharge Settings Successfully Updated', 'success');
      })
      .catch((err) => {
        makeToast(
          'An error occurred. Please contact Credit Key Support',
          'error'
        );
      })
      .finally(() => setLoading(false));
  };

  if (!defaultTermSettings?.length) return;

  return (
    <div className="flex flex-col gap-2 w-full" role={DefaultTermsDisplay.role}>
      {defaultTermSettings && (
        <DefaultTermSettingsModal
          modalState={modalState}
          onSave={onSave}
          isModalActive={isModalActive}
          toggleModal={toggleModal}
          loading={loading}
        />
      )}
      {defaultTermSettings.map((s, idx) => {
        return (
          <div
            key={idx}
            className="flex flex-col sm:flex-row md:flex-col xl:flex-row gap-1 justify-between items-start sm:items-center md:items-start xl:items-center"
          >
            <p className="font-avenir-book text-opaque-navy text-sm pr-1">
              Merchant Name:
              <strong className="ml-1">{s.merchant_name}</strong>
            </p>
            <div className="flex items-center">
              {!s.default_term ? (
                <strong
                  className="text-primary-blue text-sm cursor-pointer border-b border-transparent hover:border-primary-blue"
                  onClick={() => {
                    setModalState(s);
                    toggleModal();
                  }}
                >
                  Add Default Term
                </strong>
              ) : (
                <p className="font-avenir-book text-opaque-navy text-sm pr-1">
                  Default Term:
                  <strong className="ml-1">{getTermDisplay(s)}</strong>
                  {entity?.tier !== 'NETX' && (
                    <FontAwesomeIcon
                      className="ml-2 text-primary-blue cursor-pointer"
                      icon={faEdit}
                      onClick={() => {
                        setModalState(s);
                        toggleModal();
                      }}
                    />
                  )}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

DefaultTermsDisplay.role = 'default-term-display-component';
