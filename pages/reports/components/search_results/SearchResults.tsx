import React from 'react';
import { Index, Hits } from 'react-instantsearch';

import ApplicationHit from './hit_types/ApplicationHit';
import CompanyHit from './hit_types/CompanyHit';
import OrderHit from './hit_types/OrderHit';
import UserHit from './hit_types/UserHit';
import { NoResults, NoResultsBoundary } from './NoResults';

export default function SearchResults({ query }) {
  const results = document.querySelectorAll('#search_result');

  return (
    <div className="my-3 mx-2">
      <Index indexName="companies">
        <NoResultsBoundary
          type="companies"
          fallback={
            <NoResults
              query={query}
              type="company"
              hideFallbackMsg={query.length > 1 && !results.length}
            />
          }
        >
          <Hits hitComponent={CompanyHit} />
        </NoResultsBoundary>
      </Index>
      <Index indexName="orders">
        <NoResultsBoundary
          type="orders"
          fallback={
            <NoResults
              query={query}
              type="order"
              hideFallbackMsg={query.length > 1 && !results.length}
            />
          }
        >
          <Hits hitComponent={OrderHit} />
        </NoResultsBoundary>
      </Index>
      <Index indexName="credit_key_applications">
        <NoResultsBoundary
          type="credit_key_applications"
          fallback={
            <NoResults
              query={query}
              type="application"
              hideFallbackMsg={query.length > 1 && !results.length}
            />
          }
        >
          <Hits hitComponent={ApplicationHit} />
        </NoResultsBoundary>
      </Index>
      <Index indexName="users">
        <NoResultsBoundary
          type="users"
          fallback={
            <NoResults
              query={query}
              type="user"
              hideFallbackMsg={query.length > 1 && !results.length}
            />
          }
        >
          <Hits hitComponent={UserHit} />
        </NoResultsBoundary>
      </Index>
    </div>
  );
}
