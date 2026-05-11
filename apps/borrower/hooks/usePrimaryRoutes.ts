import {
  faCartShopping,
  faCircleQuestion,
  faCreditCard,
  faFile,
  faGift,
  faMoneyBillTransfer,
  faStore,
  faUser,
} from '@fortawesome/pro-light-svg-icons';
import { faHouseBlank } from '@fortawesome/pro-solid-svg-icons';

import { useEntity } from '@contexts/EntityContext';
import { useActiveSubscription } from '@hooks/useSubscription';
import { marketplace } from '@lib/actions/marketplace';
import { supportLink } from '@lib/constants/SiteVariables';

function usePrimaryRoutes() {
  const { entity, entityLoading } = useEntity();
  const { activeSubscription } = useActiveSubscription(entity?.id);
  const mobileApp = localStorage.getItem('mobileApp') === 'true';
  const isAmazonExclusive = entity?.isAmazonExclusive ?? false;
  const isNetX = entity?.isNetX ?? false;
  const plusVisible = (!!entity?.plus_enabled || !!activeSubscription) && !isAmazonExclusive;
  const rewardsVisible =
    entity?.underwriting_status === 'approved' && !isAmazonExclusive && !isNetX;

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
      enabled: !entityLoading && !mobileApp && marketplace.enabled && !isAmazonExclusive,
    },
    {
      icon: faGift,
      name: 'Plus+',
      url: '/plus',
      enabled: plusVisible,
      separator: true,
    },
    {
      icon: faGift,
      name: 'Rewards',
      url: '/rewards',
      enabled: rewardsVisible,
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
