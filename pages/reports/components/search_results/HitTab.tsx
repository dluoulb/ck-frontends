import React from "react";
import { Index, Hits } from "react-instantsearch";

import ApplicationHit from "./hit_types/ApplicationHit";
import CompanyHit from "./hit_types/CompanyHit";
import OrderHit from "./hit_types/OrderHit";
import UserHit from "./hit_types/UserHit";
import { NoResults, NoResultsBoundary } from "./NoResults";

export default function HitTab({ type, query }) {
  const getComponent = () => {
    switch (type) {
      case "orders":
        return OrderHit;
      case "credit_key_applications":
        return ApplicationHit;
      case "users":
        return UserHit;
      case "companies":
        return CompanyHit;
    }
  };

  return (
    <div className="my-3 mx-2">
      <Index indexName={type}>
        <NoResultsBoundary
          type={type}
          fallback={<NoResults query={query} hideFallbackMsg={true} />}
        >
          <Hits hitComponent={getComponent()} />
        </NoResultsBoundary>
      </Index>
    </div>
  );
}
