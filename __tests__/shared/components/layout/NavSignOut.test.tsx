import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { signOut } from 'supertokens-auth-react/recipe/session';

import MobileNav from '@components/layout/MobileNav';
import TopNav from '@components/layout/TopNav';
import { UserContext } from '@contexts/UserContext';
import { authRedirectLink } from '@lib/constants/SiteVariables';
import { capturePortalSessionEnded, resetPostHog } from '@lib/posthog';

const uiActionPromises: Promise<unknown>[] = [];
const recordUiAction = (result?: unknown) => {
  if (result && typeof (result as Promise<unknown>).then === 'function') {
    uiActionPromises.push(Promise.resolve(result));
  }

  return result;
};

jest.mock('next/router');
jest.mock('supertokens-auth-react/recipe/session', () => ({
  signOut: jest.fn(() => Promise.resolve()),
}));
jest.mock('@apps/borrower/hooks/useSecondaryRoutes', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    secondaryRoutes: [
      {
        section: 'left',
        items: [],
      },
      {
        section: 'right',
        items: [
          {
            type: 'dropdown',
            name: 'Account',
            children: [
              {
                name: 'Sign out',
                action: 'signout',
              },
            ],
          },
        ],
      },
    ],
  })),
}));
jest.mock('@apps/borrower/hooks/usePrimaryRoutes', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    primaryRoutes: [],
  })),
}));
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => null,
}));
jest.mock('@radix-ui/react-navigation-menu', () => ({
  Root: ({ children }) => <div>{children}</div>,
  List: ({ children }) => <div>{children}</div>,
  Item: ({ children }) => <div>{children}</div>,
}));
jest.mock('@radix-ui/react-dropdown-menu', () => ({
  Root: ({ children }) => <div>{children}</div>,
  Trigger: ({ children }) => <div>{children}</div>,
  Content: ({ children }) => <div>{children}</div>,
  Label: ({ children }) => <div>{children}</div>,
  Separator: () => <hr />,
  Item: ({ children, onSelect }) => (
    <button onClick={() => recordUiAction(onSelect?.())}>{children}</button>
  ),
}));
jest.mock('@headlessui/react', () => ({
  Disclosure: ({ children }) => <div>{children}</div>,
  DisclosureButton: ({ children, onClick, ...props }) => (
    <button onClick={(event) => recordUiAction(onClick?.(event))} {...props}>
      {children}
    </button>
  ),
  DisclosurePanel: ({ children }) => <div>{children}</div>,
}));
jest.mock('@lib/posthog', () => ({
  capturePortalSessionEnded: jest.fn(),
  resetPostHog: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;
const mockCapturePortalSessionEnded = capturePortalSessionEnded as jest.MockedFunction<
  typeof capturePortalSessionEnded
>;
const mockResetPostHog = resetPostHog as jest.MockedFunction<typeof resetPostHog>;
const requestIncreaseLink = '/borrower?request_credit_increase=true';
const cleanedBorrowerLink = 'http://localhost/borrower';
const originalSuperTokensWebsiteDomain = process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN;

type UserSession = Partial<
  Pick<React.ContextType<typeof UserContext>, 'isAdminUser' | 'isImpersonating'>
>;

const createUserContextValue = ({
  isAdminUser = false,
  isImpersonating = false,
}: UserSession = {}): React.ContextType<typeof UserContext> => ({
  user: null,
  userLoading: false,
  isAdminUser,
  isImpersonating,
  parentID: '',
  getCurrentUser: jest.fn(),
  setUser: jest.fn(),
});

const renderTopNav = (session: UserSession = {}) =>
  render(
    <UserContext.Provider value={createUserContextValue(session)}>
      <TopNav />
    </UserContext.Provider>,
  );

const renderMobileNav = (session: UserSession = {}) =>
  render(
    <UserContext.Provider value={createUserContextValue(session)}>
      <MobileNav />
    </UserContext.Provider>,
  );

const setRouter = () => {
  const push = jest.fn();

  mockUseRouter.mockReturnValue({
    asPath: requestIncreaseLink,
    pathname: '/borrower',
    push,
  } as any);

  return { push };
};

const expectRedirectToUseCleanedLocation = async (push: jest.Mock) => {
  await waitFor(() => {
    expect(push).toHaveBeenCalledWith(authRedirectLink(cleanedBorrowerLink));
  });
};

type NavRenderer = (session?: UserSession) => ReturnType<typeof render>;

const signOutThroughNav = async (renderNav: NavRenderer, session: UserSession = {}) => {
  setRouter();
  renderNav(session);

  fireEvent.click(screen.getByRole('button', { name: /sign out/i }));

  await waitFor(() => {
    expect(mockSignOut).toHaveBeenCalled();
  });
};

const expectBorrowerSignOutAnalytics = async (renderNav: NavRenderer) => {
  await signOutThroughNav(renderNav);

  expect(mockCapturePortalSessionEnded).toHaveBeenCalledTimes(1);
  expect(mockResetPostHog).toHaveBeenCalledTimes(1);
  expect(mockCapturePortalSessionEnded.mock.invocationCallOrder[0]).toBeLessThan(
    mockResetPostHog.mock.invocationCallOrder[0],
  );
};

const expectPrivilegedSignOutAnalytics = async (renderNav: NavRenderer, session: UserSession) => {
  await signOutThroughNav(renderNav, session);

  expect(mockCapturePortalSessionEnded).not.toHaveBeenCalled();
  expect(mockResetPostHog).toHaveBeenCalledTimes(1);
};

const expectRejectedPrivilegedSignOutDoesNotResetPostHog = async (renderNav: NavRenderer) => {
  const { push } = setRouter();
  const signOutError = new Error('sign out failed');
  mockSignOut.mockRejectedValueOnce(signOutError);

  renderNav({ isAdminUser: true, isImpersonating: false });

  fireEvent.click(screen.getByRole('button', { name: /sign out/i }));

  expect(uiActionPromises).toHaveLength(1);
  await expect(uiActionPromises[0]).rejects.toThrow('sign out failed');
  expect(mockCapturePortalSessionEnded).not.toHaveBeenCalled();
  expect(mockResetPostHog).not.toHaveBeenCalled();
  expect(push).not.toHaveBeenCalled();
};

const expectRejectedBorrowerSignOutDoesNotCaptureOrReset = async (renderNav: NavRenderer) => {
  const { push } = setRouter();
  const signOutError = new Error('sign out failed');
  mockSignOut.mockRejectedValueOnce(signOutError);

  renderNav({ isAdminUser: false, isImpersonating: false });

  fireEvent.click(screen.getByRole('button', { name: /sign out/i }));

  expect(uiActionPromises).toHaveLength(1);
  await expect(uiActionPromises[0]).rejects.toThrow('sign out failed');
  expect(mockCapturePortalSessionEnded).not.toHaveBeenCalled();
  expect(mockResetPostHog).not.toHaveBeenCalled();
  expect(push).not.toHaveBeenCalled();
};

const expectBorrowerSignOutCapturesAfterSignOut = async (renderNav: NavRenderer) => {
  const captureOrder: string[] = [];
  mockSignOut.mockImplementationOnce(async () => {
    captureOrder.push('signOut');
  });
  mockCapturePortalSessionEnded.mockImplementationOnce(() => {
    captureOrder.push('capturePortalSessionEnded');
  });

  await signOutThroughNav(renderNav);

  expect(captureOrder).toEqual(['signOut', 'capturePortalSessionEnded']);
};

describe('borrower nav sign-out redirects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    uiActionPromises.length = 0;
    process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN = 'https://login.creditkey.com';
    localStorage.setItem('mobileApp', 'false');
    window.history.replaceState({}, '', requestIncreaseLink);
  });

  afterAll(() => {
    if (originalSuperTokensWebsiteDomain === undefined) {
      delete process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN;
      return;
    }

    process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN = originalSuperTokensWebsiteDomain;
  });

  test('TopNav signs out with the cleaned borrower URL after the deep link is consumed', async () => {
    const { push } = setRouter();

    renderTopNav();

    window.history.replaceState({}, '', '/borrower');
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
    await expectRedirectToUseCleanedLocation(push);
  });

  test('TopNav preserves the cleaned borrower URL even if signOut mutates location before resolving', async () => {
    const { push } = setRouter();
    mockSignOut.mockImplementationOnce(async () => {
      window.history.replaceState({}, '', '/logged-out');
    });

    renderTopNav();

    window.history.replaceState({}, '', '/borrower');
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
    await expectRedirectToUseCleanedLocation(push);
  });

  test.each([
    ['admin', { isAdminUser: true, isImpersonating: false }],
    ['impersonated', { isAdminUser: false, isImpersonating: true }],
  ])(
    'TopNav skips portal session capture for %s sessions but still resets PostHog on sign-out',
    async (_label, session) => {
      await expectPrivilegedSignOutAnalytics(renderTopNav, session);
    },
  );

  test('TopNav captures portal session ended before resetting PostHog for borrower sessions on sign-out', async () => {
    await expectBorrowerSignOutAnalytics(renderTopNav);
  });

  test('MobileNav signs out with the cleaned borrower URL after the deep link is consumed', async () => {
    const { push } = setRouter();

    renderMobileNav();

    window.history.replaceState({}, '', '/borrower');
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
    await expectRedirectToUseCleanedLocation(push);
  });

  test('MobileNav preserves the cleaned borrower URL even if signOut mutates location before resolving', async () => {
    const { push } = setRouter();
    mockSignOut.mockImplementationOnce(async () => {
      window.history.replaceState({}, '', '/logged-out');
    });

    renderMobileNav();

    window.history.replaceState({}, '', '/borrower');
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
    await expectRedirectToUseCleanedLocation(push);
  });

  test('MobileNav captures portal session ended before resetting PostHog for borrower sessions on sign-out', async () => {
    await expectBorrowerSignOutAnalytics(renderMobileNav);
  });

  test.each([
    ['admin', { isAdminUser: true, isImpersonating: false }],
    ['impersonated', { isAdminUser: false, isImpersonating: true }],
  ])(
    'MobileNav skips portal session capture for %s sessions but still resets PostHog on sign-out',
    async (_label, session) => {
      await expectPrivilegedSignOutAnalytics(renderMobileNav, session);
    },
  );

  test.each([
    ['TopNav', renderTopNav],
    ['MobileNav', renderMobileNav],
  ])('%s does not reset PostHog when privileged sign-out rejects', async (_label, renderNav) => {
    await expectRejectedPrivilegedSignOutDoesNotResetPostHog(renderNav);
  });

  test.each([
    ['TopNav', renderTopNav],
    ['MobileNav', renderMobileNav],
  ])(
    '%s does not capture portal_session_ended or reset PostHog when borrower sign-out rejects',
    async (_label, renderNav) => {
      await expectRejectedBorrowerSignOutDoesNotCaptureOrReset(renderNav);
    },
  );

  test.each([
    ['TopNav', renderTopNav],
    ['MobileNav', renderMobileNav],
  ])(
    '%s captures portal_session_ended after signOut resolves, not before',
    async (_label, renderNav) => {
      await expectBorrowerSignOutCapturesAfterSignOut(renderNav);
    },
  );
});
