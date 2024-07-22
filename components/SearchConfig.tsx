import React, { useContext, useEffect, useState } from 'react';
import { InstantSearch } from 'react-instantsearch';
import { useQuery } from '@tanstack/react-query';
import { ApiContext } from 'contexts';
import { reportsRootConfig } from 'lib/utils/search_configs';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

import { getSearchConfig } from '../pages/reports/lib/actions/search';

const getConfig = () => {
  const router = useRouter();
  switch (router.pathname.split('/')[1]) {
    case 'reports':
      return reportsRootConfig;
    default:
      return reportsRootConfig;
  }
};

export default function SearchConfig({ children }) {
  const api = useContext(ApiContext);
  const { data: session } = useSession();
  const [searchConfig, setSearchConfig] = useState(getConfig());

  const { data, isLoading } = useQuery({
    queryKey: ['searchConfig', session?.user?.id],
    queryFn: () => getSearchConfig(api),
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && data) {
      setSearchConfig({
        ...getConfig(),
        server: { apiKey: data.key, nodes: data.nodes },
      });
    }
  }, [isLoading, data]);

  if (!searchConfig?.server?.apiKey) return null;
  const searchAdapter = new TypesenseInstantSearchAdapter(searchConfig);
  const searchClient = searchAdapter.searchClient;

  if (!searchClient) return null;

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
