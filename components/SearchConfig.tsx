import React from 'react';
import { InstantSearch } from 'react-instantsearch';
import { reportsRootConfig } from 'lib/utils/search_configs';
import { useRouter } from 'next/router';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

const getConfig = () => {
  const router = useRouter();
  switch (router.pathname.split('/')[1]) {
    case 'reports':
      return reportsRootConfig;
    default:
      return reportsRootConfig;
  }
};

export  default function SearchConfig({ children }) {
  const searchConfig = getConfig();
  const searchAdapter = new TypesenseInstantSearchAdapter(searchConfig);
  const searchClient = searchAdapter.searchClient;
  
  if (!searchClient || !searchConfig?.server?.apiKey) return null;
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
