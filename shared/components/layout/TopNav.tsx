import React from 'react';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'supertokens-auth-react/recipe/session';

import useSecondaryRoutes from '@apps/borrower/hooks/useSecondaryRoutes';
import TclWidget from '@components/layout/TclWidget';
import { BorrowerContextProvider } from '@contexts/BorrowerContext';
import { authRedirectLink } from '@lib/constants/SiteVariables';
import OrdersBadge from './OrdersBadge';

export default function TopNav() {
  const { secondaryRoutes } = useSecondaryRoutes();
  const router = useRouter();
  const href = authRedirectLink(`${window.location.origin}${router.asPath}`);

  const handleAction = async (action: string) => {
    if (action === 'signout') {
      await signOut();
      router.push(href);
    }
  };

  const renderItem = (item: any) => {
    const isActive = router.asPath === item.url;

    if (!item.type || item.type === 'link') {
      return (
        <NavigationMenu.Item key={item.name}>
          <Link
            href={item.url}
            target={item.target}
            className={classNames(
              'px-4 py-2 text-sm rounded transition-colors',
              {
                'bg-[#f1f2f5]': isActive,
                'hover:bg-gray-400 hover:text-white': !isActive,
              }
            )}
          >
            {item.name}
            {item.name === 'Orders' && (
              <BorrowerContextProvider>
                <OrdersBadge />
              </BorrowerContextProvider>
            )}
          </Link>
        </NavigationMenu.Item>
      );
    }

    if (item.type === 'info') {
      return (
        <BorrowerContextProvider>
          <TclWidget />
        </BorrowerContextProvider>
      );
    }

    if (item.type === 'dropdown') {
      const [open, setOpen] = React.useState(false);

      return (
        <NavigationMenu.Item key={item.name}>
          <DropdownMenu.Root modal={false} open={open} onOpenChange={setOpen}>
            <DropdownMenu.Trigger asChild>
              <button className="px-4 text-sm text-muted-foreground hover:text-primary flex flex-row">
                {item.name}
                <FontAwesomeIcon
                  icon={open ? faChevronUp : faChevronDown}
                  className="text-[0.6rem] pt-[5px] pl-2 font-bold"
                />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              sideOffset={8}
              className="z-50 w-48 rounded-md border bg-white shadow-md"
            >
              <DropdownMenu.Label className="m-1 px-2 py-2 text-sm text-muted-foreground font-semibold">
                Account
              </DropdownMenu.Label>
              {item.children.map((child: any) => (
                <div key={child.name}>
                  {child.separator && (
                    <DropdownMenu.Separator className="my-1 h-px bg-gray-300" />
                  )}
                  <DropdownMenu.Item
                    onSelect={() =>
                      child.action
                        ? handleAction(child.action)
                        : router.push(child.url)
                    }
                    className="m-1 px-2 py-1 cursor-pointer text-sm hover:bg-gray-100 rounded"
                  >
                    {child.name}
                  </DropdownMenu.Item>
                </div>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </NavigationMenu.Item>
      );
    }

    return null;
  };

  return (
    <div className="top-0 w-full z-50 h-12 sm:h-16 py-2 sm:py-0 pr-0 pl-2 lg:pl-8 flex justify-between items-center border-solid border-b-[1px] border-border-gray mt-[1px] bg-white">
      <NavigationMenu.Root>
        <NavigationMenu.List className="hidden md:flex gap-0 lg:gap-3 items-center">
          {secondaryRoutes
            .find((section) => section.section === 'left')
            ?.items.map(renderItem)}
        </NavigationMenu.List>
      </NavigationMenu.Root>

      <NavigationMenu.Root>
        <NavigationMenu.List className="hidden md:flex gap-0 lg:gap-3 items-center">
          {secondaryRoutes
            .find((section) => section.section === 'right')
            ?.items.map(renderItem)}
        </NavigationMenu.List>
      </NavigationMenu.Root>
    </div>
  );
}
