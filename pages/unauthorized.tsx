import React from 'react';

import Support from '@components/Support';

export default function Unauthorized() {
  return (
    <main className="mx-auto flex text-center w-full max-w-7xl flex-auto flex-col justify-center my-16">
      <p className="text-2xl font-semibold leading-8 text-error">401</p>
      <h1 className="mt-4 capitalize text-3xl font-bold tracking-tight text-primary sm:text-5xl">
        Unauthorized Access
      </h1>
      <div className="my-6 text-base text-gray-600">
        <p>User is not authorized to access this page.</p>
        <p>Please contact Credit Key support for additional support.</p>
      </div>
      <div
        onClick={() => (window.location.href = `/`)}
        className="text-primary-blue cursor-pointer"
      >
        <button
          type="button"
          className="rounded bg-secondary-blue py-2 px-3 text-sm font-semibold text-primary-blue shadow-sm hover:bg-primary-blue-hover hover:text-white"
        >
          <p>Back to Home</p>
        </button>
      </div>
      <Support asText={true} containerClass='!my-12' />
    </main>
  );
}
