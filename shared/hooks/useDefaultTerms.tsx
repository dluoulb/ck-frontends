import { useEffect, useState } from 'react';
import { useQueries } from '@tanstack/react-query';

import { getApprovedTerms } from '@lib/actions/entities';
import { getMerchant } from '@lib/actions/merchants';
import useApi from './useApi';

type Terms = {
  available: boolean;
  id: string;
  monthly_payment: string;
  rate: number;
  term: number;
  term_period: string;
  tier: string;
  total_amount: string;
  total_fees: string;
};

type Merchant = {
  id: string;
  name: string;
  supports_instore: boolean;
  supports_recharge: boolean;
  slug: string;
};

function useDefaultTerms(company, shouldFetch) {
  const api = useApi();
  const [rechargeMerchantIds, setRechargeMerchantIds] = useState([]);
  const defaultTermsList = company?.recharge_settings;
  const merchantAppliedWith = company?.merchant_applied_with;

  const merchantQueries = useQueries({
    queries: rechargeMerchantIds?.map((id) => {
      return {
        queryKey: ['merchant', id],
        queryFn: () => getMerchant(api, id),
        enabled: !!rechargeMerchantIds.length && shouldFetch,
      };
    }),
  });

  const termQueries = useQueries({
    queries: rechargeMerchantIds?.map((id) => {
      return {
        queryKey: ['approvedTerms', id],
        queryFn: () => getApprovedTerms(api, company.id, id),
        enabled: !!rechargeMerchantIds.length && shouldFetch,
      };
    }),
  });

  const queriesLoading =
    merchantQueries.some((query) => query.isLoading) ||
    termQueries.some((query) => query.isLoading);

  const merchantList = merchantQueries
    .filter((query) => query.data && !query.isError)
    .map((query) => query.data as Merchant);

  const termOptions = termQueries
    .filter((query) => query.data && !query.isError)
    .map((query, index) => {
      return {
        merchant_id: merchantList[index]?.id,
        terms: (query.data as { terms: Terms }).terms,
      };
    });

  useEffect(() => {
    if (
      defaultTermsList?.length ||
      merchantAppliedWith?.supports_recharge ||
      merchantAppliedWith?.supports_instore
    ) {
      const rechargeMerchantIdSet = new Set([
        ...defaultTermsList?.map((term) => term.merchant_id),
        merchantAppliedWith?.id,
      ]);

      setRechargeMerchantIds(Array.from(rechargeMerchantIdSet));
    }
  }, [company]);

  const defaultTermSettings = merchantList.map((merchant) => {
    if (!defaultTermsList) return null;

    return {
      merchant_id: merchant.id,
      merchant_name: merchant.name,
      merchant_slug: merchant.slug,
      default_term: (() => {
        const merchantTerm = defaultTermsList.find(
          (term) => term.merchant_id === merchant.id
        );
        return merchantTerm
          ? {
              term: merchantTerm?.default_term,
              term_period: merchantTerm?.default_term_period,
            }
          : null;
      })(),
      term_options: termOptions?.find((o) => merchant.id === o.merchant_id)
        ?.terms,
    };
  });

  return {
    defaultTermSettings,
    defaultTermsLoading: queriesLoading,
  };
}

export default useDefaultTerms;
