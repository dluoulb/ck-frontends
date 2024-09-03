import { useQueries } from '@tanstack/react-query';

import useApi from '@hooks/useApi';
import { getApprovedTerms, getMerchant } from '@lib/actions/entities';

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
};

function useDefaultTerms(company, shouldFetch = false) {
  const api = useApi();
  const defaultTermsList = company?.recharge_settings || [];

  const merchantQueries = useQueries({
    queries: defaultTermsList?.map((i) => {
      return {
        queryKey: ['merchant', i.merchant_id],
        queryFn: () => getMerchant(api, i.merchant_id),
        enabled: !!defaultTermsList.length && shouldFetch,
      };
    }),
  });

  const termQueries = useQueries({
    queries: defaultTermsList?.map((i) => {
      return {
        queryKey: ['approvedTerms', i.merchant_id],
        queryFn: () => getApprovedTerms(api, company.id, i.merchant_id),
        enabled: !!defaultTermsList.length && shouldFetch,
      };
    }),
  });

  const isLoading =
    merchantQueries.some((query) => query.isLoading) ||
    termQueries.some((query) => query.isLoading);

  const merchantList = merchantQueries
    .filter((query) => query.data && !query.isError)
    .map((query) => query.data as Merchant);

  const termOptions = termQueries
    .filter((query) => query.data && !query.isError)
    .map((query, index) => {
      return {
        merchant_id: defaultTermsList[index].merchant_id,
        terms: (query.data as { terms: Terms }).terms,
      };
    });

  const defaultTerms = defaultTermsList?.map((i) => {
    return {
      merchant_id: i.merchant_id,
      merchant_name: merchantList.find((m) => i.merchant_id === m.id)?.name,
      default_term: {
        term: i.default_term,
        term_period: i.default_term_period,
      },
      term_options: termOptions?.find((o) => i.merchant_id === o.merchant_id)
        ?.terms,
    };
  });

  return { defaultTermsLoading: isLoading, defaultTerms };
}

export default useDefaultTerms;
