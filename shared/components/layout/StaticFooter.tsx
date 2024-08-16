import React from 'react';

export default function StaticFooter() {
  return (
    <footer className="z-40 w-full h-12 sm:h-16 py-4 sm:py-0 px-6 md:px-16 shadow-none flex justify-center items-center border-t-[3px] border-border-gray bg-white">
      <div className="w-full text-tertiary-gray flex flex-col mid:flex-row justify-between mid:items-center text-sm">
        <div className="mb-2 mid:mb-0 tracking-wide mid:tracking-normal">
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
        <div className="flex flex-col gap-2 mid:gap-0 mid:flex-row mid:divide-x font-semibold mid:font-normal">
          <a
            href="https://www.creditkey.com/legal/privacy-policy"
            target="_new"
            className="mid:px-2 text-primary-blue hover:text-primary-blue-hover"
          >
            Privacy Policy
          </a>
          <a
            href="https://www.creditkey.com/legal/terms-of-service-and-electronic-disclosures"
            target="_new"
            className="mid:px-2 text-primary-blue hover:text-primary-blue-hover"
          >
            Terms of Service
          </a>
          <a
            href="https://lead.bank/privacy-and-terms"
            target="_new"
            className="mid:px-2 text-primary-blue hover:text-primary-blue-hover"
          >
            Lead Bank Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
