import { useEntity } from '@contexts/EntityContext';
import { useActiveSubscription } from '@hooks/useSubscription';
import { marketplace } from '@lib/actions/marketplace';
import { supportLink } from '@lib/constants/SiteVariables';

function useSecondaryRoutes() {
  const { entity, entityLoading } = useEntity();
  const { activeSubscription } = useActiveSubscription(entity?.id);
  const mobileApp = localStorage.getItem('mobileApp') === 'true';
  const isAmazonExclusive = entity?.isAmazonExclusive ?? false;
  const isNetX = entity?.isNetX ?? false;
  const plusVisible = (!!entity?.plus_enabled || !!activeSubscription) && !isAmazonExclusive;
  const rewardsVisible =
    ['approved', 'hold', 'declined'].includes(entity?.underwriting_status ?? '') &&
    !isAmazonExclusive &&
    !isNetX;

  const routes = [
    {
      section: 'left',
      items: [
        {
          type: 'link',
          name: 'Dashboard',
          url: '/',
          enabled: true,
        },
        {
          type: 'link',
          name: 'Orders',
          url: '/orders',
          enabled: true,
        },
        {
          type: 'link',
          name: 'Wallet',
          url: '/wallet',
          enabled: !!entity?.vc_enabled,
        },
        {
          type: 'link',
          name: 'Discover',
          url: marketplace.url,
          target: '_blank',
          enabled: !entityLoading && !mobileApp && marketplace.enabled && !isAmazonExclusive,
        },
        {
          type: 'link',
          name: 'Plus+',
          url: '/plus',
          enabled: plusVisible,
        },
      ],
    },
    {
      section: 'right',
      items: [
        {
          type: 'info',
          name: 'Remaining Credit',
          key: 'remainingCredit',
          enabled: !mobileApp,
        },
        {
          type: 'info',
          name: 'Reward Points',
          key: 'rewardPoints',
          url: '/rewards',
          enabled: !mobileApp && rewardsVisible,
        },
        {
          type: 'dropdown',
          name: 'Account',
          enabled: !mobileApp,

          children: [
            {
              name: 'Profile',
              url: '/profile',
            },
            {
              name: 'Payment Methods',
              url: '/payment_methods',
            },
            {
              name: 'Documents',
              url: '/documents',
            },
            {
              name: 'Support',
              url: supportLink,
              target: '_blank',
            },
            {
              name: 'Sign out',
              action: 'signout',
              separator: true,
            },
          ],
        },
      ],
    },
  ];

  return {
    secondaryRoutes: routes.map((section) => ({
      ...section,
      items: section.items.filter((item) => item.enabled !== false),
    })),
  };
}

export default useSecondaryRoutes;
