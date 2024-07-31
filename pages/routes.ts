import {
  faCartShopping,
  faChartSimple,
  faFileChartColumn,
  faFilePlus,
  faQuestion,
  faUser,
} from '@fortawesome/pro-regular-svg-icons';

export const routes = [
  {
    title: 'TPS Reporting UI',
    href: '/reports',
    icon: faFileChartColumn,
    iconForeground: 'text-success',
    iconBackground: 'bg-background-success',
    divClass: 'rounded-t-lg sm:rounded-tl-lg',
    disabled: false,
    description:
      'Search and review company, order, and application data for all TPS orders and loans. Includes ability to export company documents and download loan and payment plan agreements.',
  },
  {
    title: 'Analytics Admin',
    href: '/admin',
    icon: faChartSimple,
    iconForeground: 'text-purple-700',
    iconBackground: 'bg-purple-50',
    divClass: 'rounded-tr-lg',
    disabled: true,
    description:
      'Real-time KPI data dashboard including origination and conversion metrics for all merchants. UI also includes collection and pending application queues for internal operation functions.',
  },
  {
    title: 'Borrower Portal',
    href: '/borrower',
    icon: faUser,
    iconForeground: 'text-primary-blue',
    iconBackground: 'bg-secondary-blue',
    divClass: '',
    disabled: true,
    description:
      'View and manage borrower specific data dashboard like orders, payment methods, payment schedules, and general company or consumer details.',
  },
  {
    title: 'Instore Order Portal',
    href: '/instore',
    icon: faFilePlus,
    iconForeground: 'text-warning',
    iconBackground: 'bg-background-warning',
    divClass: '',
    disabled: true,
    description:
      'Create/send instore orders to borrowers for automatic approval, processing, and shipment.',
  },
  {
    title: 'Demo Application/Checkout Portal',
    href: '/react',
    icon: faCartShopping,
    iconForeground: 'text-error',
    iconBackground: 'bg-background-error',
    divClass: 'rounded-bl-lg',
    disabled: true,
    description:
      'React-based UI that allows internal team members to run applications and checkout flows for demos or testing purposes.',
  },
  {
    title: 'Documentation',
    href: '#',
    icon: faQuestion,
    iconForeground: 'text-indigo-700',
    iconBackground: 'bg-indigo-50',
    divClass: 'rounded-b-lg sm:rounded-br-lg',
    disabled: true,
    description:
      'Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut at blanditiis et quo et molestiae.',
  },
];
