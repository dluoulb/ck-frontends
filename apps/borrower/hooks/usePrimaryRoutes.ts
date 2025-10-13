import {
  faCartShopping,
  faCircleQuestion,
  faCreditCard,
  faFile,
  faMoneyBillTransfer,
  faStore,
  faUser,
} from '@fortawesome/pro-light-svg-icons';
import { useEntity } from '@contexts/EntityContext';
import { faHouseBlank } from '@fortawesome/pro-solid-svg-icons';

import { marketplace } from '@lib/actions/marketplace';
import { supportLink } from '@lib/constants/SiteVariables';

function usePrimaryRoutes() {
  const { entity } = useEntity();
  const mobileApp = localStorage.getItem('mobileApp') === 'true';

  const routes = [
    {
      icon: faHouseBlank,
      name: 'Dashboard',
      url: '/',
      enabled: !mobileApp,
    },
    {
      icon: faCartShopping,
      name: 'Orders',
      url: '/orders',
      enabled: true,
    },
    {
      icon: faCreditCard,
      name: 'Wallet',
      url: '/wallet',
      enabled: !!entity?.vc_enabled && !mobileApp,
    },
    {
      icon: faStore,
      name: 'Discover',
      url: marketplace.url,
      target: '_blank',
      enabled: !mobileApp && marketplace.enabled,
      separator: true,
    },
    {
      icon: faUser,
      name: 'Profile',
      url: '/profile',
      enabled: !mobileApp,
    },
    {
      icon: faMoneyBillTransfer,
      name: 'Payment Methods',
      url: '/payment_methods',
      enabled: true,
    },
    {
      icon: faFile,
      name: 'Documents',
      url: '/documents',
      enabled: true,
    },
    {
      icon: faCircleQuestion,
      name: 'Support',
      url: supportLink,
      target: '_blank',
      enabled: !mobileApp,
      separator: true,
    },
  ];

  return {
    primaryRoutes: routes.filter((route) => route.enabled),
  };
}
export default usePrimaryRoutes;
