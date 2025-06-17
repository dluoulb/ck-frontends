import React, { useEffect, useState } from 'react';
import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import { useEntity } from '@contexts/EntityContext';
import { createVirtualCard, updateCompany } from '@lib/actions/companies';
import { getMerchant } from '@lib/actions/merchants';
import { getApprovedTerms } from '@lib/actions/entities';
import Loading from '@components/Loading';
import { ListBox } from '@components/Dropdown';
import { ListboxOption } from '@headlessui/react';
import { faLockAlt } from '@fortawesome/pro-solid-svg-icons';
import PrimaryButton from '@components/buttons/PrimaryButton';
import MerchantRecord from '@lib/records/merchant';
import { useUser } from '@contexts/UserContext';
import FullStory from '@lib/utils/fullstory';

export default function SetDefaultTermsModal({ next }) {
  const api = useApi();
  const { makeToast } = useToast();
  const { entity, fetchEntity } = useEntity();
  const { user } = useUser();
  const [merchant, setMerchant] = useState<MerchantRecord>();
  const [terms, setTerms] = useState<any>();
  const [defaultTerm, setDefaultTerm] = useState<any>();
  const [term, setTerm] = useState<any>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleChange = (value) => {
    setTerm(value);
  };

  const updateRechargeTerm = (merchant_id, term) => {
    const existingTermIndex = entity?.recharge_settings.findIndex(
      (setting) => {
        return setting.merchant_id === merchant_id;
      }
    );

    if (existingTermIndex < 0) {
      entity?.recharge_settings.push({
        merchant_id,
        default_term: term?.term,
        default_term_period: term?.term_period,
      });
    } else {
      entity.recharge_settings[existingTermIndex].default_term = term?.term;
      entity.recharge_settings[existingTermIndex].default_term_period = term?.term_period;
    }

    return updateCompany(api, {
      ...entity,
    }, 'include=cta_banners');
  };

  const onSave = (merchant_id, term) => {
    setLoading(true);
    updateRechargeTerm(merchant_id, term)
    .then(() => {
      const fullstory = new FullStory();
      fullstory.setDefaultTermsEvent(user?.id, entity?.id, term?.term);
      makeToast('Default Term Successfully Updated', 'success');
      fetchEntity({ company_id: entity?.id });
    })
    .catch(() => {
      makeToast('An error occurred. Please contact Credit Key Support', 'error');
      setLoading(false);
    });
    createVirtualCard(api, entity?.id)
    .then(() => {
      makeToast('Credit Key Card Successfully Created', 'success');
      next();
    })
    .catch(() => {
      makeToast('Failed to create Credit Key Card. Please contact Credit Key Support', 'error');
      setLoading(false);
    });
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
    if (entity?.id && merchant?.id) {
      getApprovedTerms(api, entity.id, merchant.id)
        .then((resp) => {
          setTerms(resp.terms);
        })
        .catch(() => {
          setError(true);
        });
    }
  }, [entity, merchant]);

  useEffect(() => {
    if (merchant?.id && Array.isArray(terms)) {
      const t = {
        merchant_id: merchant.id,
        merchant_name: merchant.name,
        default_term: {
          term: 1,
          term_period: 'monthly',
        },
        term_options: terms,
      };
      setDefaultTerm(t);
    }
  }, [merchant, terms]);

  return (
    <div role={SetDefaultTermsModal.role} className="text-center">
      {!defaultTerm?.term_options ? (
        <>
          {!error ? (
            <Loading className="w-14 h-14" />
          ) : (
            <p className="text-rose-600">An error occurred. Please contact Credit Key Support</p>
          )}
        </>
        ) : (
        <>
          <div className="flex items-end justify-center px-4 text-center sm:block sm:px-0 max-w-md max-h-md mx-auto">
            <div className="mt-3 text-left sm:mt-0 sm:ml-4 sm:text-left">
              <div className="text-navy-blue">
                <p className="text-lg my-2 font-semibold font-avenir-black">
                  Default Repayment
                </p>
                <p className="my-2">
                  All purchases on your card will be set to this default term, but no worries -- you can always update the term length of each purchase before you transact.
                </p>
              </div>
              <div className="my-5">
                <ListBox
                  initialValue={defaultTerm?.default_term?.term}
                  buttonText={term?.term || 'Select Default Term'}
                  handleChange={handleChange}
                  value={term}
                  listBoxClass="my-3 rounded-md border border-dark-gray transition ease-in-out duration-150 sm:text-sm sm:leading-5 relative"
                >
                  {terms?.map((op) => (
                    <ListboxOption
                      key={op.term}
                      value={op}
                      className="cursor-pointer p-2 hover:bg-primary-blue hover:bg-opacity-70 hover:text-white last:hover:rounded-b-md"
                    >
                      {op.term}
                    </ListboxOption>
                  ))}
                </ListBox>
              </div>
            </div>
        </div>
        <div className="sm:mb-8 w-full m-auto px-4 sm:pr-0 py-3 flex justify-center items-center">
          <PrimaryButton
            ariaLabel="save-default-terms-button"
            buttonText="Next"
            buttonColor="bg-primary-blue"
            hoverClass="hover:bg-primary-blue-hover"
            containerClass="w-full"
            icon={faLockAlt}
            disabled={loading}
            isLoading={loading}
            onClick={() => onSave(defaultTerm?.merchant_id, term)}
          />
        </div>
      </>
    )}
    </div>
  );
}

SetDefaultTermsModal.role = 'set-default-terms-modal-component';
