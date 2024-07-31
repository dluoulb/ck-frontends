import React from 'react';
import Link from 'next/link';

import { fromISO } from '../../../../../lib/utils/datetime_formatters';
import {
  formatPhoneNumber,
  normalizePhone,
} from '../../../../../lib/utils/formatters';
import { address, highlightMatches } from '../helpers';

export default function UserHit({ hit }) {
  return (
    <article className="py-3 border-b w-full" key={hit.id} id="search_result">
      <div className="flex flex-col md:flex-row md:gap-3 w-full">
        <span className="w-1/3 md:w-1/10 lg:w-1/12 flex items-center justify-center rounded-md px-3 lg:px-0 py-1 capitalize font-semibold bg-violet-100 text-violet-600 text-xs tracking-wide">
          User
        </span>
        <Link
          className="text-lg font-bold text-primary-blue cursor-pointer underline"
          href={
            hit.company_id
              ? `/reports/companies/${hit.company_id}`
              : `/reports/accounts/${hit.account_id}`
          }
        >
          {hit.first_name} {hit.last_name}
        </Link>
      </div>
      <div className="capitalize grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-6 text-sm px-1">
        <div className="col-span-2">
          <p>ID: {hit.id}</p>
          <p>Created: {fromISO(hit.created_at).toLocaleString()}</p>
          <p className="normal-case">Match: {highlightMatches(hit)}</p>
        </div>
        <p className="col-span-2">
          <span className="block normal-case">Email: {hit.email}</span>
          <span className="block">Address: {address(hit.address)}</span>
        </p>
        <div className="col-span-1">
          <span className="block">
            Phone:{' '}
            {hit.phone
              ? formatPhoneNumber(normalizePhone(hit?.phone))
              : 'Not Provided'}
          </span>
          <span className="block">
            DOB:{' '}
            {hit.birthdate
              ? fromISO(hit.birthdate).toLocaleString()
              : 'Not Provided'}
          </span>
        </div>
      </div>
    </article>
  );
}
