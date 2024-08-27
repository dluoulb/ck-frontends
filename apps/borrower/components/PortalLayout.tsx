import {
  faCartShopping,
  faCircleQuestion,
  faMoneyBillTransfer,
  faUser,
} from '@fortawesome/pro-light-svg-icons';
import { faHouseBlank } from '@fortawesome/pro-solid-svg-icons';

import SideNav from '@components/layout/SideNav';
import { supportLink } from '@lib/constants/SiteVariables';

const primaryRoutes = [
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
    url: '/borrower/payment-methods',
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
  return (
    <div className="flex" role={PortalLayout.role}>
      <SideNav primaryRoutes={primaryRoutes} />
      <div className="flex-grow w-full md:w-portal ml-0 md:ml-16">{children}</div>
    </div>
  );
}

PortalLayout.role = 'page-layout-component';
