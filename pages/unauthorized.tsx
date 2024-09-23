import React from 'react';

import Support from '@components/Support';
import { useUser } from '@contexts/UserContext';

export default function Unauthorized() {
  const { user, isImpersonating } = useUser();
  const adminNotImpersonating =
    ['superadmin', 'admin'].includes(user?.role) && !isImpersonating;

  return (
    <main className="mx-auto flex text-center w-full max-w-7xl flex-auto flex-col justify-center my-16">
      <p className="text-2xl font-semibold leading-8 text-error">401</p>
      <h1 className="mt-4 capitalize text-3xl font-bold tracking-tight text-primary sm:text-5xl">
        {adminNotImpersonating ? 'Not Possessing User' : 'Unauthorized Access'}
      </h1>
      {adminNotImpersonating ? (
        <>
          <div className="my-6 text-base text-gray-600">
            <p>You are not currently possessing a user.</p>
            <p>
              Please go to a borrower's detail page in Admin and login as the
              user.
            </p>
          </div>
          <div className="flex gap-4 mx-auto">
            <div
              onClick={() =>
                (window.location.href = process.env.NEXT_PUBLIC_BASE_URL)
              }
              className="text-primary-blue cursor-pointer"
            >
              <button
                type="button"
                className="rounded bg-secondary-blue py-2 px-3 text-sm font-semibold text-primary-blue shadow-sm hover:bg-primary-blue-hover hover:text-white"
              >
                <p>Return to UI Selection</p>
              </button>
            </div>
            <div
              onClick={() =>
                (window.location.href = process.env.NEXT_PUBLIC_API_URL)
              }
              className="text-primary-blue cursor-pointer"
            >
              <button
                type="button"
                className="rounded bg-secondary-blue py-2 px-3 text-sm font-semibold text-primary-blue shadow-sm hover:bg-primary-blue-hover hover:text-white"
              >
                <p>Go to Admin</p>
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="my-6 text-base text-gray-600">
          <p>User is not authorized to access this page.</p>
          <p>Please contact Credit Key support for additional support.</p>
        </div>
      )}

      <Support asText={true} containerClass="!my-12" />
    </main>
  );
}
