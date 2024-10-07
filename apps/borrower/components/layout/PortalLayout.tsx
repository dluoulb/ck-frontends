import {
  faCartShopping,
  faCircleQuestion,
  faMoneyBillTransfer,
  faUser,
} from '@fortawesome/pro-light-svg-icons';
import { faHouseBlank } from '@fortawesome/pro-solid-svg-icons';

import SideNav from '@components/layout/SideNav';
import Scripts from '@components/Scripts';
import { useUser } from '@contexts/UserContext';
import { supportLink } from '@lib/constants/SiteVariables';
import PossessUser from './PossessUser';

export const primaryRoutes = [
  {
    icon: faHouseBlank,
    name: 'Home',
    url: '/borrower',
  },
  {
    icon: faCartShopping,
    name: 'Orders',
    url: '/borrower/orders',
  },
  {
    icon: faMoneyBillTransfer,
    name: 'Payment Methods',
    url: '/borrower/payment_methods',
  },
  {
    icon: faUser,
    name: 'My Profile',
    url: '/borrower/profile',
  },
  {
    icon: faCircleQuestion,
    name: 'Help Center',
    url: supportLink,
    target: '_blank',
  },
];

export default function PortalLayout({ children }) {
  const { isImpersonating } = useUser();

  return (
    <div className="flex" role={PortalLayout.role}>
      <Scripts />
      <SideNav primaryRoutes={primaryRoutes} />
      <div className="flex-grow w-full xl:w-portal ml-0 lg:ml-24 xl:ml-16">
        {isImpersonating && <PossessUser />}
        {children}
      </div>
    </div>
  );
}

PortalLayout.role = 'page-layout-component';
