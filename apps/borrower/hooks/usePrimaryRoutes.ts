import { useEntity } from '@contexts/EntityContext';
import { faCartShopping, faCircleQuestion, faCreditCard, faMoneyBillTransfer, faStore, faUser } from '@fortawesome/pro-light-svg-icons';
import { faHouseBlank } from '@fortawesome/pro-solid-svg-icons';
import { marketplace } from '@lib/actions/marketplace';
import { supportLink } from '@lib/constants/SiteVariables';

function usePrimaryRoutes() {
  const { entity } = useEntity();
  const multiUseVcEnabled = entity?.cta_banners?.find((b) => b.enabled)?.name === 'multi_use_virtual_card';
  const mobileApp = localStorage.getItem('mobileApp') === 'true'

  const routes = [
    {
      icon: faHouseBlank,
      name: 'Home',
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
      icon: faMoneyBillTransfer,
      name: 'Payment Methods',
      url: '/payment_methods',
      enabled: true,
    },
    {
      icon: faCreditCard,
      name: 'Virtual Card',
      url: '/virtual_card',
      enabled: multiUseVcEnabled,
    },
    {
      icon: faUser,
      name: 'My Profile',
      url: '/profile',
      enabled: !mobileApp,
    },
    {
      icon: faStore,
      name: 'Marketplace',
      url: marketplace.url,
      target: '_blank',
      enabled: !mobileApp && marketplace.enabled,
    },
    {
      icon: faCircleQuestion,
      name: 'Help Center',
      url: supportLink,
      target: '_blank',
      enabled: !mobileApp,
    },
  ];

  return {
    primaryRoutes: routes.filter(route => route.enabled),
  };
}
export default usePrimaryRoutes;

