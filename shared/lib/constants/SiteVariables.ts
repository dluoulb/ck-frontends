import {
  faCartShopping,
  faChartSimple,
  faCheckCircle,
  faExclamationTriangle,
  faFileChartColumn,
  faFileInvoiceDollar,
  faFilePlus,
  faHourglassClock,
  faQuestion,
  faShoppingCart,
  faTrashCanXmark,
  faUser,
} from '@fortawesome/pro-regular-svg-icons';
import classNames from 'classnames';

const protocol = 'https://';
const rootURI = 'creditkey.com';

export const platform = () => {
  if (process.env.NODE_ENV !== 'production') {
    return 'development';
  } else if (window.location && window.location.hostname.match(/staging/i)) {
    return 'staging';
  }

  return 'production';
};

export const server = (api = true) => {
  if (process.env && process.env.NODE_ENV !== 'production') {
    return (
      process.env.NEXT_PUBLIC_CK_WEB_VIRTUAL_HOST || 'http://localhost:9100'
    );
  }

  let subDomain = 'www';
  if (window.location && window.location.hostname.match(/staging/i)) {
    subDomain = 'staging';
  }

  const baseURI = protocol + subDomain + '.' + rootURI;

  return api ? `${baseURI}/app` : baseURI;
};

export const supportPhone = '+1 (844) 334-3636';
export const declinedSupportPhone = '+1 (844) 900-3330';

export const formStyles = {
  error: (error) =>
    classNames('input focus:border-primary-blue', {
      '!border-error': error,
    }),
  input: (multi, error) =>
    classNames('w-full', multi ? 'mb-2 sm:mb-2' : 'mb-2 ', {
      'mb-0 sm:mb-2': error,
    }),
  validation: 'text-error text-xxs sm:text-xs text-left',
};

export const supportLink = 'https://creditkey.zendesk.com/hc/en-us';
export const ckaLink = 'https://www.creditkey.com/anywhere';
export const virtualCardLink =
  'https://creditkey.zendesk.com/hc/en-us/articles/360060554031-How-can-I-use-the-Credit-Key-Virtual-Card-';

const invalidRedirectPaths = ['[id]', '[type]', '/unauthorized'];

export const authRedirectLink = (pathname) => {
  const isInvalidPath = invalidRedirectPaths.some((path) =>
    pathname.includes(path)
  );

  return `${process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN}/?r=${process.env.NEXT_PUBLIC_BASE_URL}${isInvalidPath ? '' : pathname}`;
};

export const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export const orderStatusTabs = [
  {
    name: 'all',
    icon: faShoppingCart,
    filter_value: '',
  },
  {
    name: 'active',
    icon: faFileInvoiceDollar,
    filter_value: ['funded', 'active'],
  },
  {
    name: 'pending',
    icon: faHourglassClock,
    filter_value: ['created', 'pending'],
  },
  {
    name: 'paid',
    icon: faCheckCircle,
    filter_value: 'paid',
  },
  {
    name: 'canceled',
    icon: faTrashCanXmark,
    filter_value: ['canceled', 'void'],
  },
  {
    name: 'past due',
    icon: faExclamationTriangle,
  },
];

export const routes = [
  {
    title: 'Home',
    href: '/',
    approvedRoles: ['staff', 'admin', 'superadmin'],
  },
  {
    title: 'TPS Reporting UI',
    href: '/reports',
    icon: faFileChartColumn,
    iconForeground: 'text-success',
    iconBackground: 'bg-background-success',
    divClass: 'rounded-t-lg sm:rounded-tl-lg',
    disabled: false,
    approvedRoles: ['feb', 'external', 'superadmin'],
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
    approvedRoles: ['superadmin'],
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
    disabled: false,
    approvedRoles: ['purchaser', 'borrower', 'staff', 'admin', 'superadmin'],
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
    approvedRoles: ['instore', 'merchant', 'staff', 'admin', 'superadmin'],
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
    approvedRoles: ['merchant', 'staff', 'admin', 'superadmin'],
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
    approvedRoles: [
      'purchaser',
      'borrower',
      'feb',
      'external',
      'instore',
      'merchant',
      'staff',
      'admin',
      'superadmin',
    ],
    description:
      'Doloribus dolores nostrum quia qui natus officia quod et dolorem. Sit repellendus qui ut at blanditiis et quo et molestiae.',
  },
];
