import React from 'react';
import Link from 'next/link';

import Support from '@components/Support';

export default function NoDataError({ tag, withButton }) {
  return (
    <main className="mx-auto flex text-center w-full max-w-7xl flex-auto flex-col justify-center my-16">
      <p className="text-xl font-semibold leading-8 text-primary-blue">404</p>
      <h1 className="mt-4 capitalize text-3xl font-bold tracking-tight text-primary sm:text-5xl">
        No {tag} found
      </h1>
      <p className="my-3 text-base leading-7 text-gray-600">
        Please contact Credit Key support.
      </p>
      {withButton && (
        <Link href="/reports" className="text-primary-blue cursor-pointer">
          <button
            type="button"
            className="rounded bg-secondary-blue py-2 px-3 text-sm font-semibold text-primary-blue shadow-sm hover:bg-primary-blue-hover hover:text-white"
          >
            <p>Back to Search</p>
          </button>
        </Link>
      )}
      <div className="max-w-max mx-auto">
        <Support asText={true} />
      </div>
    </main>
  );
}
