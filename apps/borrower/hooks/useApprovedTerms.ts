import { useEffect, useState } from 'react';
import { getApprovedTerms } from '@lib/actions/orders';
import useApi from '@hooks/useApi';

export type ApprovedTerm = {
  available: boolean;
  term: number;
  term_period: string;
};

export function useApprovedTerms(orderId?: string) {
  const api = useApi();
  const [terms, setTerms] = useState<ApprovedTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    setLoading(true);
    setError(false);
    getApprovedTerms(api, orderId)
      .then((resp) => setTerms(resp.terms))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [api, orderId]);

  return { terms, loading, error };
}