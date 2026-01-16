import React, { useEffect, useMemo, useState } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';

import PrimaryButton from '@components/buttons/PrimaryButton';
import Loading from '@components/Loading';
import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import { createVirtualCard, updateRechargeTerm } from '@lib/actions/companies';
import { getApprovedTerms } from '@lib/actions/entities';
import { getMerchant } from '@lib/actions/merchants';
import MerchantRecord from '@lib/records/merchant';
import { getTermLabel } from '@lib/utils/formatters';
import FullStory from '@lib/utils/fullstory';

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

  const onSave = async (merchant_id, term) => {
    if (!term) {
      makeToast('Please select a default term', 'error');
      return;
    }
    setLoading(true);
    try {
      await updateRechargeTerm(api, entity, merchant_id, term?.term);

      const fullstory = new FullStory();
      fullstory.setDefaultTermsEvent(user?.id, entity?.id, term?.term);
      makeToast('Default Term Successfully Updated', 'success');
      fetchEntity({ company_id: entity?.id });

      if (skipCardCreate) {
        next();
        return;
      }

      try {
        await createVirtualCard(api, entity?.id);
        makeToast('Credit Key Card Successfully Created', 'success');
        next();
      } catch (error) {
        makeToast('Failed to create Credit Key Card. Please contact Credit Key Support', 'error');
      }
    } catch (error) {
      makeToast('An error occurred. Please contact Credit Key Support', 'error');
    } finally {
      setLoading(false);
    }
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

  const sortedTerms = useMemo(() => {
    if (!terms) return [];

    return [...terms].sort((a, b) => {
      if (a.term === 4 && a.term_period === 'biweekly') return -1;
      if (b.term === 4 && b.term_period === 'biweekly') return 1;

      if (a.term_period === 'monthly' && b.term_period === 'monthly') {
        return a.term - b.term;
      }

      if (a.term_period === 'monthly') return 1;
      if (b.term_period === 'monthly') return -1;

      return 0;
    });
  }, [terms]);

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
            <div className="mt-3 text-left sm:mt-0 sm:text-left">
              <div className="text-navy-blue">
                <p className="text-lg my-2 font-semibold font-avenir-black">
                  Set default payment terms
                </p>
                <p className="my-2">
                  Purchases made with your Credit Key Card will default to the following repayment
                  terms. You can always edit terms for specific transactions, or change this default
                  term later.
                </p>
              </div>
              <div className="mt-5">
                <RadioGroup.Root
                  value={term?.term?.toString()}
                  onValueChange={(value) => {
                    const selectedTerm = terms?.find((t) => t.term.toString() === value);
                    handleChange(selectedTerm);
                  }}
                  className="my-3 space-y-3"
                >
                  {sortedTerms?.map((op) => (
                    <label
                      key={`${op.term}-${op.term_period}`}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 data-[state=checked]:border-primary-blue data-[state=checked]:bg-blue-50"
                      onClick={() => handleChange(op)}
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroup.Item
                          value={op.term.toString()}
                          className="w-4 h-4 rounded-full border border-gray-300 data-[state=checked]:bg-primary-blue data-[state=checked]:border-primary-blue flex items-center justify-center"
                        >
                          <RadioGroup.Indicator className="w-2 h-2 rounded-full bg-white" />
                        </RadioGroup.Item>
                        <span className="font-medium text-gray-900">{getTermLabel(op)}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {op.rate === 0 ? '0%' : `${op.rate.toFixed(2)}% monthly`}
                      </span>
                    </label>
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
