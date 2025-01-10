import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { InstantSearch } from 'react-instantsearch';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

import { getSearchConfig } from '@lib/actions/search';
import { reportsRootConfig } from '@lib/utils/search_configs';

const getConfig = () => {
  // Adjust if / when other UIs use typesense search
  const router = useRouter();
  switch (router.pathname.split('/')[1]) {
    case 'reports':
      return reportsRootConfig;
    default:
      return reportsRootConfig;
  }
};

export default function SearchConfig({ children }) {
  const router = useRouter();
  const route = router.pathname.split('/')[1];
  const [searchClient, setSearchClient] = useState(null);
  const searchConfigParams = getConfig();

  const { data: searchConfigServerKey } = useQuery({
    queryKey: ['search_config', route],
    queryFn: () => getSearchConfig(),
    enabled: !searchClient,
    retry: false,
  });

  useEffect(() => {
    if (searchConfigServerKey) {
      const searchConfig = {
        ...searchConfigParams,
        server: { ...searchConfigParams.server, apiKey: searchConfigServerKey },
      };
      const searchAdapter = new TypesenseInstantSearchAdapter(searchConfig);
      setSearchClient(searchAdapter.searchClient);
    }
  }, [searchConfigServerKey, searchConfigParams]);

  if (!searchClient) return <>{children}</>;

  return (
    <>
      <InstantSearch
        searchClient={searchClient}
        indexName="orders"
        future={{
          preserveSharedStateOnUnmount: true,
        }}
      >
        {children}
      </InstantSearch>
    </>
  );
}
