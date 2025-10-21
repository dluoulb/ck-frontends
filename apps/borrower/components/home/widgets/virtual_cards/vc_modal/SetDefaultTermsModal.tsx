import React, { useEffect, useState } from 'react';

import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import { createVirtualCard, updateRechargeTerm } from '@lib/actions/companies';
import { getApprovedTerms } from '@lib/actions/entities';
import Loading from '@components/Loading';
import * as RadioGroup from '@radix-ui/react-radio-group';
import PrimaryButton from '@components/buttons/PrimaryButton';
import MerchantRecord from '@lib/records/merchant';
import { getMerchant } from '@lib/actions/merchants';
import FullStory from '@lib/utils/fullstory';
import { getTermLabel } from '@lib/utils/formatters';

export default function SetDefaultTermsModal({ next, skipCardCreate }) {
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

  const onSave = (merchant_id, term) => {
    if (!term) {
      makeToast('Please select a default term', 'error');
      return;
    }
    setLoading(true);
    updateRechargeTerm(api, entity, merchant_id, term?.term)
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

    if (skipCardCreate) {
      next();
      return;
    }

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
        makeToast(
          'An error occurred. Please contact Credit Key Support',
          'error'
        );
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
            <p className="text-rose-600">
              An error occurred. Please contact Credit Key Support
            </p>
          )}
        </>
      ) : (
        <>
          <div className="flex items-end justify-center px-4 text-center sm:block sm:px-0 max-w-md max-h-md mx-auto">
            <div className="mt-3 text-left sm:mt-0 sm:text-left">
              <div className="text-navy-blue">
                <p className="text-lg my-2 font-semibold font-avenir-black">
                  Set default payment terms
                </p>
                <p className="my-2">
                  Purchases made with your Credit Key Card will default to the following repayment terms. You can always edit terms for specific transactions, or change this default term later.
                </p>
              </div>
              <div className="mt-5">
                <RadioGroup.Root
                  value={term?.term?.toString()}
                  onValueChange={(value) => {
                    const selectedTerm = terms?.find(t => t.term.toString() === value);
                    handleChange(selectedTerm);
                  }}
                  className="my-3 space-y-3"
                >
                  {terms?.map((op) => (
                    <div key={op.term} className="flex items-center space-x-3 p-3 rounded-md border border-gray-300 hover:border-primary-blue transition-colors">
                      <RadioGroup.Item
                        value={op.term.toString()}
                        id={`term-${op.term}`}
                        className="w-5 h-5 rounded-full border-2 border-gray-300 data-[state=checked]:border-primary-blue data-[state=checked]:bg-primary-blue flex items-center justify-center outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
                      >
                        <RadioGroup.Indicator className="w-2 h-2 rounded-full bg-white" />
                      </RadioGroup.Item>
                      <label
                        htmlFor={`term-${op.term}`}
                        className="flex-1 cursor-pointer text-sm font-semibold text-gray-900 flex justify-between items-center"
                      >
                        {getTermLabel(op)} {op.term === 1 ? 'month' : 'months'}
                        {op.rate && (
                          <span className="font-normal">
                            {op.rate}% monthly
                          </span>
                        )}
                      </label>
                    </div>
                  ))}
                </RadioGroup.Root>
              </div>
            </div>
        </div>
        <div className="w-full m-auto px-4 sm:px-0 py-3 flex justify-center items-center">
          <PrimaryButton
            ariaLabel="save-default-terms-button"
            buttonText="Next"
            buttonColor="bg-primary-blue"
            hoverClass="hover:bg-primary-blue-hover"
            containerClass="w-full"
            disabled={loading || !term}
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
