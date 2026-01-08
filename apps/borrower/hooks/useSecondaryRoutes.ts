import {useEntity} from '@contexts/EntityContext';
import {marketplace} from '@lib/actions/marketplace';
import {supportLink} from '@lib/constants/SiteVariables';

function useSecondaryRoutes() {
    const {entity} = useEntity();
    const mobileApp = localStorage.getItem('mobileApp') === 'true';

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
                    enabled: !mobileApp && marketplace.enabled,
                },
                {
                    type: 'link',
                    name: 'Plus+',
                    url: '/plus',
                    enabled: !!entity?.plus_enabled,
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
                    enabled: !mobileApp && !!entity?.plus_enabled,
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
