import '@testing-library/jest-dom';

import { useEntity } from '@contexts/EntityContext';
import useCompanyUsers from '@hooks/useCompanyUsers';
import useDefaultTerms from '@hooks/useDefaultTerms';
import useOrders from '@hooks/useOrders';
import usePaymentMethods from '@hooks/usePaymentMethods';
import useStats from '@hooks/useStats';
import {
  companyApproved,
  defaultTerms,
  orderA,
  orderB,
  orderC,
  paymentMethodBank1,
  paymentMethodCard1,
  stats,
  user,
} from '@lib/testing/records';

global.scrollTo = jest.fn();

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    query: {},
    pathname: '',
  }),
}));

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('supertokens-auth-react', () => {
  return {
    SuperTokensWrapper: ({ children }) => children,
    init: jest.fn(),
  };
});

export const mockApi = {
  defaults: { headers: { common: {} } },
  interceptors: {
    response: { use: jest.fn(), eject: jest.fn() },
  },
  get: jest.fn(),
};

jest.mock('@hooks/useApi', () => () => mockApi);
jest.mock('@hooks/useOrders', () => jest.fn());
jest.mock('@hooks/usePaymentMethods', () => jest.fn());
jest.mock('@hooks/useDefaultTerms', () => jest.fn());
jest.mock('@hooks/useCompanyUsers', () => jest.fn());
jest.mock('@hooks/useStats', () => jest.fn());
jest.mock('@contexts/EntityContext', () => ({
  ...jest.requireActual('@contexts/EntityContext'),
  useEntity: jest.fn(),
}));

global.mockedUseOrders = useOrders as jest.MockedFunction<typeof useOrders>;
global.mockedUseEntity = useEntity as jest.MockedFunction<typeof useEntity>;
global.mockedUseCompanyUsers = useCompanyUsers as jest.MockedFunction<
  typeof useCompanyUsers
>;
global.mockedUseStats = useStats as jest.MockedFunction<typeof useStats>;
global.mockedUsePaymentMethods = usePaymentMethods as jest.MockedFunction<
  typeof usePaymentMethods
>;
global.mockedUseDefaultTerms = useDefaultTerms as jest.MockedFunction<
  typeof useDefaultTerms
>;

global.mockedUseEntity.mockImplementation(() => ({
  entity: companyApproved,
  setEntity: jest.fn(),
  fetchEntity: jest.fn(),
  entityError: null,
  entityLoading: false,
}));

global.mockedUseCompanyUsers.mockImplementation(() => ({
  companyUsers: [user],
  companyUsersError: null,
  companyUsersLoading: false,
  companyUsersRefetching: false,
  refetchCompanyUsers: jest.fn(),
}));

global.mockedUseOrders.mockImplementation(() => ({
  orders: [orderA, orderB, orderC],
  ordersLoading: false,
  isFetching: false,
  ordersError: null,
  pageCount: 1,
}));

global.mockedUseDefaultTerms.mockImplementation(() => ({
  defaultTerms: defaultTerms,
  defaultTermsLoading: false,
}));

global.mockedUseStats.mockImplementation(() => ({
  stats,
  statsError: null,
  statsLoading: false,
}));

global.mockedUsePaymentMethods.mockImplementation(() => ({
  activePaymentMethods: [paymentMethodBank1, paymentMethodCard1],
  defaultBankLabel: paymentMethodBank1.label,
  defaultCardLabel: paymentMethodCard1.label,
  defaultCard: paymentMethodCard1,
  defaultBank: paymentMethodBank1,
  paymentMethods: [paymentMethodBank1, paymentMethodCard1],
  paymentMethodsError: null,
  paymentMethodsLoading: false,
  paymentMethodsRefetching: false,
  refetchPaymentMethods: mockRefetchPaymentMethods,
}));

const mockRefetchPaymentMethods = jest.fn(() =>
  Promise.resolve({
    data: [paymentMethodBank1, paymentMethodCard1],
    error: null,
    isFetching: false,
    isLoading: false,
    status: 'success',
  } as any)
);

class MockResizeObserver {
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    this.callback(
      [
        { target, contentRect: { width: 100, height: 100 } },
      ] as ResizeObserverEntry[],
      this
    );
  }

  unobserve(target: Element) {}

  disconnect() {}
}

global.ResizeObserver = MockResizeObserver as any;

beforeEach(() => {
  jest.restoreAllMocks();
});
