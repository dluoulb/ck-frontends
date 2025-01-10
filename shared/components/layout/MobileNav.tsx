import {
  faArrowRightFromBracket,
  faBars,
  faXmark,
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { signOut } from 'supertokens-auth-react/recipe/session';

import { authRedirectLink } from '@lib/constants/SiteVariables';
import usePrimaryRoutes from '@apps/borrower/hooks/usePrimaryRoutes';


export default function MobileNav() {
  const router = useRouter();
  const href = authRedirectLink(`${window.location.origin}${router.asPath}`);
  const { primaryRoutes } = usePrimaryRoutes();
  const navigation = [{ route: '/borrower', routes: primaryRoutes }];

  const getRoutes = () => {
    const route = navigation.find((item) =>
      router.pathname.includes(item.route)
    );
    return route?.routes || [];
  };

  return (
    <Disclosure as="nav" className="md:hidden relative">
      <div className="mx-auto max-w-7xl">
        <div className="relative flex h-16 items-center justify-between">
          <div className="relative">
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-primary-blue-hover hover:bg-secondary-blue">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <FontAwesomeIcon
                icon={faBars}
                aria-hidden="true"
                className="block h-5 w-5 group-data-[open]:hidden"
              />
              <FontAwesomeIcon
                icon={faXmark}
                aria-hidden="true"
                className="hidden h-5 w-5 group-data-[open]:block"
              />
            </DisclosureButton>
            <DisclosurePanel className="absolute right-0 bg-secondary-blue min-w-60 rounded-md">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {getRoutes().map((item) => (
                  <DisclosureButton
                    key={item.name}
                    as="a"
                    href={item.url}
                    target={item.target}
                    aria-current={
                      router.pathname === item.url ? 'page' : undefined
                    }
                    className={classNames(
                      router.pathname === item.url
                        ? 'bg-primary-blue-hover text-white'
                        : 'text-primary-blue-hover hover:bg-primary-blue-hover/80 hover:text-white',
                      'block rounded-md px-3 py-2 text-sm font-medium'
                    )}
                  >
                    {item.name}
                  </DisclosureButton>
                ))}
                <DisclosureButton
                  as="div"
                  onClick={async () => {
                    await signOut();
                    router.push(href);
                  }}
                  className="text-primary-blue-hover hover:bg-primary-blue-hover/80 hover:text-white block rounded-md px-3 py-2 text-sm font-medium flex items-center gap-2"
                >
                  <p>Sign Out</p>
                  <FontAwesomeIcon icon={faArrowRightFromBracket} />
                </DisclosureButton>
              </div>
            </DisclosurePanel>
          </div>
        </div>
      </div>
    </Disclosure>
  );
}
