import React from 'react';
import { faArrowRightFromBracket } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Session, { signOut } from 'supertokens-auth-react/recipe/session';

import logo from '../../lib/images/logo.svg';

export default function StaticHeader() {
  const router = useRouter();
  const href =
    process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN +
    `/?r=${process.env.NEXT_PUBLIC_BASE_URL}${router.pathname}`;

  return (
    <nav className="flex-shrink-0 h-12 sm:h-16 py-4 sm:py-0 px-6 md:px-16 shadow-none flex justify-between items-center rounded-none border-solid border-b-[3px] border-border-gray">
      <div
        className={classNames('flex items-center', {
          'w-full justify-center': !Session?.doesSessionExist,
        })}
      >
        <Image
          src={logo}
          alt="Credit Key Logo"
          className={classNames(Session?.doesSessionExist ? 'w-4/5' : 'w-1/8')}
        />
      </div>
      {Session?.doesSessionExist && (
        <div className="flex items-center justify-around gap-2 text-primary-blue text-sm font-semibold hover:cursor-pointer hover:text-primary-blue-hover">
          <p
            onClick={async () => {
              await signOut();
              router.push(href);
            }}
            className="hover:underline sm:hover:no-underline underline-offset-8 decoration-1"
          >
            Sign Out
          </p>
          <FontAwesomeIcon
            icon={faArrowRightFromBracket}
            className="hidden sm:inline"
          />
        </div>
      )}
    </nav>
  );
}
