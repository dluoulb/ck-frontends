import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import useApi from '@hooks/useApi';
import { createLinkToken, setAccessToken } from '@lib/actions/plaid';

function usePlaid(user) {
  const api = useApi();
  const queryClient = useQueryClient();
  const [publicToken, setPublicToken] = useState(null);

  const {
    data: linkToken,
    refetch: fetchLinkToken,
    isPending: linkTokenLoading,
  } = useQuery({
    queryKey: ['plaid-link-token', user?.id],
    queryFn: () => createLinkToken(api),
    enabled: false,
    retry: 1,
  });

  const {
    data: accessToken,
    refetch: fetchAccessToken,
    isPending: accessTokenLoading,
  } = useQuery({
    queryKey: ['plaid-access-token', user?.id],
    queryFn: () => setAccessToken(api, publicToken),
    enabled: !!(user && publicToken && linkToken),
    retry: 0,
  });

  const exchangePublicToken = (publicToken) => {
    setPublicToken(publicToken);
  };

  const resetLinkFlow = () => {
    queryClient.removeQueries({ queryKey: ['plaid-link-token', user?.id] });
    queryClient.removeQueries({ queryKey: ['plaid-access-token', user?.id] });
  };

  return {
    linkToken,
    fetchLinkToken,
    linkTokenLoading,
    accessToken,
    fetchAccessToken,
    accessTokenLoading,
    exchangePublicToken,
    resetLinkFlow,
  };
}

export default usePlaid;
