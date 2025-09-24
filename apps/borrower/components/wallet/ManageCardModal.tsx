import React, { useEffect, useMemo, useState } from 'react';
import {
  faCopy,
  faEnvelope,
  faPhone,
  faCreditCard
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import DefaultTermSettingsModal from '@apps/borrower/components/home/widgets/default_settings/DefaultTermsModal';
import Loading from '@components/Loading';
import ModalWrapper from '@components/modals/ModalWrapper';
import { useEntity } from '@contexts/EntityContext';
import useApi from '@hooks/useApi';
import useModal from '@hooks/useModal';
import useToast from '@hooks/useToast';
import { updateRechargeTerm } from '@lib/actions/companies';
import { getApprovedTerms } from '@lib/actions/entities';
import { getMerchant } from '@lib/actions/merchants';
import { multiUseVcIvrPhone, supportPhone } from '@lib/constants/SiteVariables';
import { getTermDisplay } from '@lib/utils/formatters';

interface ManageCardModalProps {
  isModalActive: boolean;
  toggleModal: () => void;
}

export default function ManageCardModal({
  isModalActive,
  toggleModal,
}: ManageCardModalProps) {
  const { entity } = useEntity();
  const api = useApi();
  const { makeToast } = useToast();
  const { fetchEntity } = useEntity();

  const [merchant, setMerchant] = useState(null);
  const [virtualCardTerm, setVirtualCardTerm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const {
    toggleModal: toggleTermModal,
    isModalActive: isTermModalActive,
    modalState,
    setModalState,
  } = useModal(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    if (!isModalActive) return;

    getMerchant(api, 'virtual')
      .then((merchant) => {
        setMerchant(merchant);
      })
      .catch(() => {
        makeToast(
          'An error occurred. Please contact Credit Key Support',
          'error'
        );
        setError(true);
      });
  }, [isModalActive]);

  useEffect(() => {
    if (!merchant || !entity?.id) return;

    const existingTerm = entity?.recharge_settings?.find(
      (setting) => setting.merchant_id === merchant.id
    );

    if (existingTerm) {
      setVirtualCardTerm({
        merchant_id: merchant.id,
        merchant_name: merchant.name,
        default_term: {
          term: existingTerm.default_term,
          term_period: existingTerm.default_term_period,
        },
      });
    }

    getApprovedTerms(api, entity.id, merchant.id)
      .then((resp) => {
        setVirtualCardTerm((prev) => ({
          ...prev,
          merchant_id: merchant.id,
          merchant_name: merchant.name,
          term_options: resp.terms,
        }));
      })
      .catch(() => {
        setError(true);
      });
  }, [merchant, entity]);

  const onSaveTerm = (merchant_id, term) => {
    setLoading(true);
    updateRechargeTerm(api, entity, merchant_id, term?.term)
      .then(() => {
        fetchEntity({ company_id: entity?.id });
        toggleTermModal();
        makeToast('Default Term Successfully Updated', 'success');
      })
      .catch((err) => {
        makeToast(
          'An error occurred. Please contact Credit Key Support',
          'error'
        );
      })
      .finally(() => setLoading(false));
  };

  const billingInfo = useMemo(() => {
    const owner = entity?.type === 'company' ? entity?.borrower : entity?.user;

    return {
      name: owner
        ? `${owner.first_name} ${owner.last_name}`.trim()
        : 'Not Provided',
      address: {
        street: entity?.address?.address1 || 'Not Provided',
        city:
          entity?.address?.city && entity?.address?.state
            ? `${entity.address.city}, ${entity.address.state}, US`
            : 'Not Provided',
        zip: entity?.address?.zip || 'Not Provided',
      },
    };
  }, [entity]);

  return (
    <ModalWrapper
      isModalActive={isModalActive}
      toggleModal={toggleModal}
      header="Manage Card"
      headerIcon={faCreditCard}
    >
      <div className="space-y-6 mt-4">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900">
            Card Billing Information
          </h3>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-gray">
                {billingInfo.name}
              </span>
              <button
                onClick={() => handleCopy(billingInfo.name)}
                className="text-secondary-gray/60 hover:text-secondary-gray transition-colors"
              >
                <FontAwesomeIcon icon={faCopy} className="text-sm" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-gray">
                {billingInfo.address.street}
              </span>
              <button
                onClick={() => handleCopy(billingInfo.address.street)}
                className="text-secondary-gray/60 hover:text-secondary-gray transition-colors"
              >
                <FontAwesomeIcon icon={faCopy} className="text-sm" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-gray">
                {billingInfo.address.city}
              </span>
              <button
                onClick={() => handleCopy(billingInfo.address.city)}
                className="text-secondary-gray/60 hover:text-secondary-gray transition-colors"
              >
                <FontAwesomeIcon icon={faCopy} className="text-sm" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-secondary-gray">
                {billingInfo.address.zip}
              </span>
              <button
                onClick={() => handleCopy(billingInfo.address.zip)}
                className="text-secondary-gray/60 hover:text-secondary-gray transition-colors"
              >
                <FontAwesomeIcon icon={faCopy} className="text-sm" />
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900">
            Default Term for Card Purchases
          </h3>

          <div className="space-y-1">
            {!virtualCardTerm && !error && <Loading className="w-6 h-6" />}
            {error && (
              <p className="text-sm text-error">
                Error loading default term settings
              </p>
            )}
            {virtualCardTerm && (
              <>
                <p className="text-sm text-secondary-gray">
                  Card purchases will default to a{' '}
                  <span className="font-bold">
                    {virtualCardTerm.default_term
                      ? getTermDisplay(virtualCardTerm)
                      : 'No default term set'}
                  </span>{' '}
                  repayment term. You can choose to change the term after an
                  order is placed.
                </p>

                <button
                  className="text-primary-blue hover:text-primary-blue/80 font-medium text-base"
                  onClick={() => {
                    setModalState(virtualCardTerm);
                    toggleTermModal();
                  }}
                >
                  {virtualCardTerm.default_term
                    ? 'Edit Default Term'
                    : 'Set Default Term'}
                </button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-900">
            Need assistance? We're happy to help.
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-secondary-gray">
                Support available Monday - Friday from 9 AM - 1 PM & 2 PM - 6 PM
                CT
              </p>
              <p className="text-sm text-secondary-gray">
                When purchasing in-person, you may be asked for a PIN.
                <span className="block">
                  Call {multiUseVcIvrPhone} to set your pin.
                </span>
              </p>
            </div>

            <div className="space-y-3">
              <a
                href={`tel:${supportPhone}`}
                className="flex items-center gap-2 no-underline text-primary-blue hover:text-primary-blue/80 cursor-pointer font-medium"
              >
                <FontAwesomeIcon icon={faPhone} className="text-sm" />
                Call:{supportPhone}
              </a>

              <a
                href="mailto:support@creditkey.com"
                className="flex items-center gap-2 text-primary-blue hover:text-primary-blue/80 font-medium text-base"
              >
                <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
                Email: support@creditkey.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <DefaultTermSettingsModal
        modalState={modalState}
        onSave={onSaveTerm}
        isModalActive={isTermModalActive}
        toggleModal={toggleTermModal}
        loading={loading}
      />
    </ModalWrapper>
  );
}
