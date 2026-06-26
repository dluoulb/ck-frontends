import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { signOut } from 'supertokens-auth-react/recipe/session';

import MobileNav from '@components/layout/MobileNav';
import TopNav from '@components/layout/TopNav';
import { authRedirectLink } from '@lib/constants/SiteVariables';

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
  Item: ({ children, onSelect }) => <button onClick={() => onSelect?.()}>{children}</button>,
}));
jest.mock('@headlessui/react', () => ({
  Disclosure: ({ children }) => <div>{children}</div>,
  DisclosureButton: ({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  DisclosurePanel: ({ children }) => <div>{children}</div>,
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>;
const requestIncreaseLink = '/borrower?request_credit_increase=true';
const cleanedBorrowerLink = 'http://localhost/borrower';
const originalSuperTokensWebsiteDomain = process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN;

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

describe('borrower nav sign-out redirects', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

    render(<TopNav />);

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

    render(<TopNav />);

    window.history.replaceState({}, '', '/borrower');
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
    await expectRedirectToUseCleanedLocation(push);
  });

  test('MobileNav signs out with the cleaned borrower URL after the deep link is consumed', async () => {
    const { push } = setRouter();

    render(<MobileNav />);

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

    render(<MobileNav />);

    window.history.replaceState({}, '', '/borrower');
    fireEvent.click(screen.getByRole('button', { name: /sign out/i }));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
    await expectRedirectToUseCleanedLocation(push);
  });
});
