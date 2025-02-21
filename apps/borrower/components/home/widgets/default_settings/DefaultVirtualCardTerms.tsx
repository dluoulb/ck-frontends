import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useEntity } from '@contexts/EntityContext';
import useApi from '@hooks/useApi';
import useModal from '@hooks/useModal';
import useToast from '@hooks/useToast';
import { updateRechargeTerm } from '@lib/actions/companies';
import DefaultTermSettingsModal from './DefaultTermsModal';
import { getMerchant } from '@lib/actions/merchants';
import { faEdit, faInfoCircle } from '@fortawesome/pro-regular-svg-icons';
import MerchantRecord from '@lib/records/merchant';
import { getApprovedTerms } from '@lib/actions/entities';
import Loading from '@components/Loading';

export default function DefaultVirtualCardTerms() {
  const api = useApi();
  const { makeToast } = useToast();
  const { entity, fetchEntity } = useEntity();
  const { defaultTermSettings } = useBorrowerDeps();
  const [merchant, setMerchant] = useState<MerchantRecord>();
  const [defaultVCTerm, setDefaultVCTerm] = useState<any>();
  const [error, setError] = useState(false);

  const [loading, setLoading] = useState(false);
  const { toggleModal, isModalActive, modalState, setModalState } = useModal(
    defaultTermSettings[0]
  );

  const getTermDisplay = (term) => {
    if (term.default_term?.term_period === 'days') return '30 Days';

    if (term.default_term?.term > 1) {
      return `${term.default_term?.term} Months`;
    } else {
      return `${term.default_term?.term} Month`;
    }
  };

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

  useEffect(() => {
    getMerchant(api, 'virtual')
      .then((merchant) => {
        setMerchant(merchant);
      })
      .catch(() => {
        makeToast('An error occurred. Please contact Credit Key Support', 'error');
        setError(true);
      });
  }, []);

  useEffect(() => {
    if (!merchant) return;

    const virtualCardDefaultTerm = (defaultTermSettings || []).find(setting => {
        return setting.merchant_id === merchant.id;
      });
    setDefaultVCTerm(virtualCardDefaultTerm);

    if (!virtualCardDefaultTerm) {
      getApprovedTerms(api, entity.id, merchant.id)
      .then((resp) => {
        setDefaultVCTerm({
          merchant_id: merchant.id,
          merchant_name: merchant.name,
          term_options: resp.terms,
        });
      })
      .catch(() => {
        setError(true);
      });
    }
  }, [defaultTermSettings, merchant]);

  return (
    <div className="flex flex-col gap-2 w-full" role={DefaultVirtualCardTerms.role}>
      {!defaultVCTerm && !error && (<Loading />)}
      {!defaultVCTerm && error && (<p className="text-rose-600">Error loading default terms</p>)}
      {defaultTermSettings && (
        <DefaultTermSettingsModal
          modalState={modalState}
          onSave={onSave}
          isModalActive={isModalActive}
          toggleModal={toggleModal}
          loading={loading}
        />
      )}
      {defaultVCTerm && (
        <div className="px-3 p-2">
          <div className="flex items-center gap-2.5 border-b border-primary-blue-hover/30 pb-3">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="text-primary-blue text-base lg:text-xl"
            />

            <p className="text-lg md:text-xl font-bold">Default Terms</p>
          </div>
          <div className="space-y-2 md:space-y-4 flex flex-col xs:flex-row md:flex-col xl:flex-row gap-1 justify-between items-start xs:items-center md:items-start xl:items-center">
            <p className="font-avenir-book text-opaque-navy text-sm pr-1">
              Merchant Name:
              <strong className="ml-1">{defaultVCTerm.merchant_name}</strong>
            </p>
            <div className="flex items-center">
              {!defaultVCTerm?.default_term ? (
                <strong
                  className="text-primary-blue-hover text-sm cursor-pointer border-b border-transparent hover:border-primary-blue"
                  onClick={() => {
                    setModalState(defaultVCTerm);
                    toggleModal();
                  }}
                >
                  Add Default Term
                </strong>
              ) : (
                <p className="font-avenir-book text-opaque-navy text-sm pr-1">
                  Default Term:
                  <strong className="ml-1">{getTermDisplay(defaultVCTerm)}</strong>
                  {entity?.tier !== 'NETX' && (
                    <FontAwesomeIcon
                      className="ml-2 text-primary-blue cursor-pointer"
                      icon={faEdit}
                      onClick={() => {
                        setModalState(defaultVCTerm);
                        toggleModal();
                      }}
                    />
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

DefaultVirtualCardTerms.role = 'default-virtual-card-terms-component';

