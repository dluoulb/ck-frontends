import PortalLayout from '@apps/borrower/components/PortalLayout';
import { renders } from '@lib/testing/sharedTests';

const primaryRoutes = [
  {
    name: 'Home',
    url: '/borrower',
  },
  {
    name: 'Orders',
    url: '/borrower/orders',
  },
  {
    name: 'Payment Methods',
    url: '/borrower/payment_methods',
  },
  {
    name: 'My Profile',
    url: '/borrower/profile',
  },
  {
    name: 'Help Center',
    url: '/test-support',
    target: '_blank',
  },
];

describe('Portal Layout Component', () => {
  renders(PortalLayout, primaryRoutes);
});
