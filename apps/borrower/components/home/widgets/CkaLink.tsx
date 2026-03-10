import React from 'react';
import { faArrowRight, faArrowUpFromBracket } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import { ckaLink } from '@lib/constants/SiteVariables';

export default function CkaLink() {
  return (
    <div className="w-full">
      <Link href={ckaLink} target="_blank" className="min-w-50 max-h-max">
        <div className="flex justify-between border border-border-gray hover:bg-gray-100 rounded-md px-6 p-4">
          <div className="flex items-center gap-3 basis-[80%]">
            <FontAwesomeIcon
              icon={faArrowUpFromBracket}
              className="text-xl md:text-2xl w-[32px] text-primary-blue"
            />
            <div>
              <p className="text-lg md:text-xl text-primary font-semibold">Upload Invoice</p>
              <p className="flex gap-2 text-[#333333]">
                <span>
                  Pay invoices using your available credit.{' '}
                  <span className="items-center cursor-pointer text-primary-blue hover:text-primary-blue-hover border-b border-transparent hover:border-primary-blue-hover font-medium">
                    Learn more
                  </span>
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center justify-end basis-[20%]">
            <FontAwesomeIcon icon={faArrowRight} />
          </div>
        </div>
      </Link>
    </div>
  );
}
