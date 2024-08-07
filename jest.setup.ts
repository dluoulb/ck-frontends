import '@testing-library/jest-dom';
global.scrollTo = jest.fn();

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
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
