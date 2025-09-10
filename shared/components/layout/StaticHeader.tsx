import React from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import Session from 'supertokens-auth-react/recipe/session';

import MobileNav from './MobileNav';
import TopNav from './TopNav';
import logo from '../../lib/images/logo.svg';

export default function StaticHeader() {
  return (
    <nav className="fixed top-0 w-full z-50 h-12 sm:h-16 py-4 sm:py-0 px-6 md:px-10 lg:px-20 shadow-none flex justify-between items-center rounded-none border-solid border-b-[1px] border-border-gray bg-white">
      <div
        className={classNames('flex items-center', {
          'w-full justify-center': !Session?.doesSessionExist,
        })}
      >
        <Link href="/" passHref>
          <Image
            src={logo}
            alt="Credit Key Logo"
            className={Session?.doesSessionExist ? 'w-full min-w-[100px]' : 'w-1/8'}
          />
        </Link>
      </div>
      {Session?.doesSessionExist && (
        <>
          <TopNav />
          <div className="flex items-center justify-around gap-2 text-primary-blue text-sm font-semibold hover:cursor-pointer hover:text-primary-blue-hover">
            <MobileNav />
          </div>
        </>
      )}
    </nav>
  );
}
