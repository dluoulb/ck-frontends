import React, { useContext, useEffect, useState } from "react";
import { InstantSearch } from "react-instantsearch";
import { useQuery } from "@tanstack/react-query";
import TypesenseInstantSearchAdapter from "typesense-instantsearch-adapter";

import { ApiContext } from "contexts";
import { getSearchConfig } from "../lib/actions/search";
import { useSession } from "next-auth/react";

const rootConfig = {
  server: {
    apiKey: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY,
    nodes: [
      {
        host: process.env.NEXT_PUBLIC_TYPESENSE_SERVER,
        port: Number(process.env.NEXT_PUBLIC_TYPESENSE_PORT),
        protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
      },
    ],
  },
  additionalSearchParameters: {
    query_by: "name, company_name, email, phone",
  },
  collectionSpecificSearchParameters: {
    companies: {
      query_by: "name, dba, ein, phone",
    },

    orders: {
      query_by:
        "merchant_order_id, order_key, first_name, last_name, email, phone",
    },

    users: {
      query_by: "company_name, company_id, email, first_name, last_name, phone",
    },

    credit_key_applications: {
      query_by:
        "company_name, company_id, dba, email, business_phone, ein, first_name, last_name, phone",
    },
  },
};

export default function SearchConfig({ children }) {
  const api = useContext(ApiContext);
  const { data: session } = useSession();
  const [searchConfig, setSearchConfig] = useState(rootConfig);

  const { data, isLoading } = useQuery({
    queryKey: ["searchConfig", session?.user?.id],
    queryFn: () => getSearchConfig(api),
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && data) {
      setSearchConfig({
        ...rootConfig,
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
