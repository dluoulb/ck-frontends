import React from 'react';
import { faFileInvoiceDollar } from '@fortawesome/pro-regular-svg-icons';
import { faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import { ckaLink } from '@lib/constants/SiteVariables';

export default function CreditKeyAnywhere({ vcEnabled }) {
  return (
    <div className="px-3 p-2 h-full" role={CreditKeyAnywhere.role}>
      <div className="flex items-center gap-2.5 border-b border-primary-blue-hover/30 pb-3">
        <FontAwesomeIcon
          icon={faFileInvoiceDollar}
          className="text-primary-blue text-base lg:text-xl"
        />
        <p className="text-lg md:text-xl font-bold">Credit Key Anywhere</p>
      </div>
      <div className="text-sm md:text-base h-full mt-3 md:mt-6 mb-2 space-y-2">
        <p className="font-medium">Pay your invoices with Credit Key Anywhere!</p>
        <p className={classNames('text-sm', vcEnabled ? 'md:min-h-24 md:max-h-36' : '!mt-1 !mb-6')}>
          Submit your unpaid invoice and we'll connect with the vendor to pay it for you using your
          existing line of credit.
        </p>
        <a
          href={ckaLink}
          target="_blank"
          className="flex items-center gap-1 cursor-pointer hover:text-primary-blue-hover border-b border-transparent hover:border-primary-blue-hover font-medium text-primary-blue-hover max-w-max !mt-6 md:!mt-0"
        >
          <span>Submit New Invoice</span>
          <FontAwesomeIcon
            icon={faChevronRight}
            className="text-[0.6rem] mt-[0.175rem] font-bold"
          />
        </a>
      </div>
    </div>
  );
}

CreditKeyAnywhere.role = 'cka-widget';
