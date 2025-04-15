import React from 'react';

export default function StaticFooter() {
  return (
    <footer className="!z-40 w-full absolute lg:fixed bottom-0 left-0 px-6 md:px-16 shadow-none flex justify-center items-center border-t-[3px] border-border-gray bg-white">
      <div className="w-full text-tertiary-gray flex flex-col mid:flex-row justify-between mid:items-center text-sm py-4">
        <div className="mb-2 mid:mb-0 tracking-wide mid:tracking-normal md:w-1/2 xl:w-2/3">
          Credit Key is not a bank. Certain business-purpose loans made by Lead Bank 
          and subject to credit approval. Personal guaranty may be required. Borrower
          must be a valid business in good standing. Fees vary based on loan amount.
          The Credit Key Prepaid Mastercard® is issued by Sutton Bank, Member FDIC,
          pursuant to license by Mastercard International Inc.
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
