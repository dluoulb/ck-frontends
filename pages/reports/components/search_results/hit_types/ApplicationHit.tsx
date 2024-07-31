import React from 'react';
import Link from 'next/link';

import { fromISO } from '../../../../../lib/utils/datetime_formatters';
import { address, highlightMatches } from '../helpers';

export default function ApplicationHit({ hit }) {
  if (!hit?.company_id) return;

  return (
    <article className="py-3 border-b w-full" key={hit.id} id="search_result">
      <div className="flex flex-col md:flex-row md:gap-3 w-full">
        <span className="w-1/3 md:w-1/10 lg:w-1/12 flex items-center justify-center rounded-md px-3 lg:px-0 py-1 capitalize font-semibold text-orange-600 text-xs tracking-wide bg-orange-100">
          Application
        </span>
        <Link
          className="text-lg font-bold text-primary-blue cursor-pointer underline"
          href={`/reports/companies/${hit.company_id}`}
        >
          {hit.company_name}
        </Link>
      </div>
      <div className="capitalize grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-6 text-sm px-1">
        <div className="col-span-2">
          <p>ID: {hit.id}</p>
          <p>Created: {fromISO(hit.created_at).toLocaleString()}</p>
          <p className="normal-case">Match: {highlightMatches(hit)}</p>
        </div>
        <p className="col-span-2">
          <span className="block">
            Owner: {hit.first_name} {hit.last_name}
          </span>
          <span className="block normal-case">Email: {hit.email}</span>
          <span className="block">
            Business Address: {address(hit.business_address)}
          </span>
        </p>
        <div className="col-span-1">
          <span className="block">Status: {hit.status}</span>
          <span className="block">
            Tier: {hit.tier.includes('_') ? hit.tier.slice(5) : hit.tier}
          </span>
        </div>
      </div>
    </article>
  );
}
