import React from 'react';
import Link from 'next/link';

import { fromISO } from '../../../../../lib/utils/datetime_formatters';
import { address, highlightMatches } from '../helpers';

export default function CompanyHit({ hit }) {
  return (
    <article className="py-3 border-b w-full" key={hit.id} id="search_result">
      <div className="flex gap-3 w-full">
        <span className="md:w-1/10 lg:w-1/12 flex items-center justify-center rounded-md px-3 lg:px-0 py-1 capitalize font-semibold text-success text-xs tracking-wide bg-background-success">
          Company
        </span>
        <Link
          className="text-lg font-bold text-primary-blue cursor-pointer underline"
          href={`/companies/${hit.id}`}
        >
          {hit.name}
        </Link>
      </div>
      <div className="capitalize grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-6 text-sm px-1">
        <div className="col-span-2">
          <p>ID: {hit.id}</p>
          <p>Created: {fromISO(hit.created_at).toLocaleString()}</p>
          <p className="normal-case">Match: {highlightMatches(hit)}</p>
        </div>
        <p className="col-span-2">
          <span className="block">EIN: {hit.ein}</span>
          <span className="block">Address: {address(hit.address)}</span>
        </p>
        <div className="col-span-1">
          <p>Status: {hit.underwriting_status}</p>
          <p>Tier: {hit.tier.includes('_') ? hit.tier.slice(5) : hit.tier}</p>
        </div>
      </div>
    </article>
  );
}
