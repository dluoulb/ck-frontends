import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Image from 'next/image';
import { faArrowRightFromBracket } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { signOut, useSession } from 'next-auth/react';

import logo from '../../lib/images/logo.svg';

export default function StaticHeader() {
  const { data: session } = useSession();
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  return (
    <nav className="flex-shrink-0 h-12 sm:h-16 py-4 sm:py-0 px-4 md:px-16 shadow-none flex justify-between items-center rounded-none border-solid border-b-[3px] border-border-gray">
      <div
        className={classNames('flex items-center', {
          'w-full justify-center': !session?.user,
        })}
      >
        <Image
          src={logo}
          alt="Credit Key Logo"
          className={classNames(session?.user ? 'w-4/5' : 'w-1/8')}
        />
      </div>
      {session?.user && (
        <div className="flex items-center justify-around gap-2 text-primary-blue text-sm font-semibold hover:cursor-pointer hover:text-primary-blue-hover">
          <p
            onClick={() => signOut({ callbackUrl: `/login` })}
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
