import { faArrowUpRight } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Link from 'next/link';

import { routes } from '@lib/constants/SiteVariables';

export default function Home() {
  return (
    <main>
      <div className="xl:max-w-[90%] mx-auto">
        <h1 className="text-3xl font-bold text-primary my-6">
          Welcome to Credit Key
        </h1>
        <div className="border border-primary-gray-border rounded-lg bg-slate-50 mb-16">
          <div className="overflow-hidden grid grid-cols-1 sm:grid-cols-2 sm:gap-px">
            {routes.slice(1).map((route, routeIdx) => (
              <Link
                href={route.href}
                key={route.title}
                className={classNames(
                  routeIdx < 4 && 'border-b',
                  routeIdx === routes.length - 1 && 'border-t sm:border-t-0',
                  [1, 3, 5].includes(routeIdx) && 'sm:border-l',
                  route.disabled
                    ? '!cursor-not-allowed'
                    : 'bg-white hover:bg-secondary-blue',
                  route.divClass,
                  'group relative p-6'
                )}
              >
                <span
                  className={classNames(
                    route.iconBackground,
                    route.iconForeground,
                    'inline-flex rounded-lg p-3'
                  )}
                >
                  <FontAwesomeIcon icon={route.icon} className="text-lg" />
                </span>
                <div className="mt-4 sm:mt-8">
                  <h3 className="text-base font-semibold text-lg leading-6 text-primary">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {route.title}
                  </h3>
                  <p className="mt-2 text-sm text-secondary-gray">
                    {route.description}
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="absolute right-6 top-6 text-gray-300 group-hover:text-primary-blue-hover"
                >
                  {route.disabled ? (
                    <span className="inline-flex items-center text-xs bg-gray-300 text-tertiary-gray px-2 py-1 uppercase rounded-md font-semibold tracking-wide mb-2 sm:mb-0 w-max sm:w-auto">
                      Disabled
                    </span>
                  ) : (
                    <FontAwesomeIcon
                      icon={faArrowUpRight}
                      className="text-3xl"
                    />
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
