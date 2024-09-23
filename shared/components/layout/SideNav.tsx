import React, { useState } from 'react';
import {
  faBars,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Link from 'next/link';

import { useUser } from '@contexts/UserContext';

export default function SideNav({ primaryRoutes }) {
  const [extend, setExtend] = useState(false);
  const { user } = useUser();

  const toggleExtend = () => {
    setExtend(!extend);
  };

  window.addEventListener(
    'resize',
    () => window.innerWidth <= 1425 && setExtend(false)
  );

  return (
    <div
      className={`hidden md:inline-block bg-secondary-blue h-full z-30 ease-in-out duration-500 fixed left-0 ${
        extend ? 'w-72' : 'overflow-hidden w-sidenav'
      }`}
    >
      <div
        className={classNames('px-2 m-6 flex items-start gap-2', {
          'border-b border-primary-blue-hover/20': extend,
        })}
      >
        <div
          className="flex items-center gap-2 mt-1.5 mb-12 cursor-pointer shrink-0 text-primary-blue-hover"
          onClick={toggleExtend}
        >
          <FontAwesomeIcon
            icon={faChevronLeft}
            className={classNames(
              'text-xs transition-all duration-500 ease-out',
              extend ? 'opacity-100' : 'hidden opacity-0'
            )}
          />
          <FontAwesomeIcon icon={faBars} className="text-lg" />
          <FontAwesomeIcon
            icon={faChevronRight}
            className={classNames(
              'text-xs transition-all duration-500 ease-out',
              extend ? 'opacity-0' : 'opacity-100'
            )}
          />
        </div>
        <div
          className={classNames(
            'transition-all duration-1500 ease-out whitespace-nowrap',
            extend ? 'opacity-100' : 'hidden opacity-0'
          )}
        >
          <p className="font-semibold">Logged in as:</p>
          <p className="text-sm">
            {user?.first_name} {user?.last_name}
          </p>
        </div>
      </div>
      <div className="flex items-center mt-6">
        <div className="w-full">
          {primaryRoutes.map((_r, idx) => {
            return (
              <div className="text-primary-blue-hover" key={idx}>
                {_r.name === 'Help Center' ? (
                  <a
                    href={_r.url}
                    target={_r.target}
                    className="w-1 h-full rounded-tr-md rounded-br-md cursor-pointer hover:text-primary-blue-hover transition flex items-center py-2 md:py-3"
                  >
                    <FontAwesomeIcon
                      icon={_r.icon}
                      className="px-8 shrink-0 min-w-[24px] text-xl"
                    />
                    <div className="text-sm md:text-base whitespace-nowrap">
                      {_r.name}
                    </div>
                  </a>
                ) : (
                  <Link
                    href={_r.url}
                    className="w-1 h-full rounded-tr-md rounded-br-md cursor-pointer hover:text-primary-blue transition ease-in-out duration-500 flex items-center py-2 md:py-3"
                  >
                    <FontAwesomeIcon
                      icon={_r.icon}
                      className="px-8 shrink-0 min-w-[24px] text-xl"
                    />
                    <div className="text-sm md:text-base whitespace-nowrap">
                      {_r.name}
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
