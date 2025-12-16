import {
  faCartShopping,
  faCircleQuestion,
  faCreditCard,
  faFile,
  faMoneyBillTransfer,
  faStore,
  faUser,
  faGift,
  faStar,
} from '@fortawesome/pro-light-svg-icons';
import { useEntity } from '@contexts/EntityContext';
import { faHouseBlank } from '@fortawesome/pro-solid-svg-icons';

import { marketplace } from '@lib/actions/marketplace';
import { supportLink, plusEnabled, plusCohorts, rewardsEnabled } from '@lib/constants/SiteVariables';
import { useActiveSubscription } from '@hooks/useSubscription';

function usePrimaryRoutes() {
  const { entity } = useEntity();
  const mobileApp = localStorage.getItem('mobileApp') === 'true';
  
  const canSeePlus = plusEnabled && 
    plusCohorts.some(cohort => entity?.active_cohorts?.includes(cohort));

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
    },
    {
      icon: faGift,
      name: 'Plus+',
      url: '/plus',
      enabled: canSeePlus,
      separator: true,
    },
    {
      icon: faGift,
      name: 'Rewards',
      url: '/rewards',
      enabled: canSeePlus,
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
