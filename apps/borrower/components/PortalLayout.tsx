import {
  faCartShopping,
  faCircleQuestion,
  faMoneyBillTransfer,
  faUser,
} from '@fortawesome/pro-light-svg-icons';
import { faHouseBlank } from '@fortawesome/pro-solid-svg-icons';

import SideNav from '@components/layout/SideNav';
import Loading from '@components/Loading';
import Scripts from '@components/Scripts';
import { usePossessedUser } from '@contexts/PossessedUserContext';
import useUser from '@hooks/useUser';
import { supportLink } from '@lib/constants/SiteVariables';
import PossessUser from './PossessUser';

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
  const { user } = useUser();
  const isAdminUser = user?.is_admin_user;
  const { possessedEntityLoading } = usePossessedUser();

  return (
    <div className="flex" role={PortalLayout.role}>
      <Scripts />
      <SideNav primaryRoutes={primaryRoutes} />
      <div className="flex-grow w-full md:w-portal ml-0 md:ml-24 xl:ml-16">
        {isAdminUser && <PossessUser />}
        {possessedEntityLoading ? (
          <Loading className="w-14 h-14 my-36" />
        ) : (
          children
        )}
      </div>
    </div>
  );
}

PortalLayout.role = 'page-layout-component';
