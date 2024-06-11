import React from 'react';

export default function StaticFooter() {
  return (
    <footer className="flex-shrink-0 w-full max-h-max py-4 px-6 md:px-16 shadow-none flex justify-between md:items-center rounded-none border-solid border-t-[3px] border-border-gray">
      <div className="w-full text-tertiary-gray flex flex-col md:flex-row justify-between md:items-center text-xs sm:text-sm">
        <div className="mb-2 md:mb-0 tracking-wide md:tracking-normal">
          Loans made by Lead Bank. Visit
          <a
            href="https://www.creditkey.com/"
            target="_new"
            className="mx-1 underline text-primary-blue hover:text-primary-blue-hover"
          >
            creditkey.com
          </a>
          for more info.
        </div>
        <div className="flex flex-col gap-2 md:gap-0 md:flex-row md:divide-x font-semibold md:font-normal">
          <a
            href="https://www.creditkey.com/legal/privacy-policy"
            target="_new"
            className="md:px-2 text-primary-blue hover:text-primary-blue-hover"
          >
            Privacy Policy
          </a>
          <a
            href="https://www.creditkey.com/legal/terms-of-service-and-electronic-disclosures"
            target="_new"
            className="md:px-2 text-primary-blue hover:text-primary-blue-hover"
          >
            Terms of Service
          </a>
          <a
            href="https://lead.bank/privacy-and-terms"
            target="_new"
            className="md:px-2 text-primary-blue hover:text-primary-blue-hover"
          >
            Lead Bank Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
