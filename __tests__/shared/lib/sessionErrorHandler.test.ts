import Session, { attemptRefreshingSession, signOut } from 'supertokens-auth-react/recipe/session';

import { createResponseErrorHandler } from '@lib/sessionErrorHandler';

jest.mock('pages/_app', () => ({}), { virtual: true });

jest.mock('supertokens-auth-react/recipe/session', () => ({
  __esModule: true,
  default: {
    getAccessToken: jest.fn(),
  },
  attemptRefreshingSession: jest.fn(),
  signOut: jest.fn(),
}));

describe('createResponseErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not sign out on a 403 response', async () => {
    const api = jest.fn();
    const error = {
      response: { status: 403 },
      config: { headers: {} },
    };

    await expect(createResponseErrorHandler(api)(error)).rejects.toMatchObject(error);
    expect(signOut).not.toHaveBeenCalled();
  });

  test('retries the request with a refreshed token after a 401', async () => {
    const api = jest.fn().mockResolvedValue({ data: { ok: true } }) as jest.Mock & {
      defaults: { headers: { common: Record<string, string> } };
    };
    api.defaults = { headers: { common: {} as Record<string, string> } };
    const originalRequest = { headers: {} as Record<string, string> };

    (attemptRefreshingSession as jest.Mock).mockResolvedValue(true);
    (Session.getAccessToken as jest.Mock).mockResolvedValue('token-2');

    await expect(
      createResponseErrorHandler(api)({
        response: { status: 401 },
        config: originalRequest,
      }),
    ).resolves.toEqual({ data: { ok: true } });

    expect(api).toHaveBeenCalledWith({
      ...originalRequest,
      _retry: true,
      headers: {
        Authorization: 'Bearer token-2',
      },
    });
    expect(api.defaults.headers.common['Authorization']).toBe('Bearer token-2');
    expect(signOut).not.toHaveBeenCalled();
  });

  test('signs out when a 401 refresh attempt fails', async () => {
    const api = jest.fn();

    (attemptRefreshingSession as jest.Mock).mockResolvedValue(false);

    await expect(
      createResponseErrorHandler(api)({
        response: { status: 401 },
        config: { headers: {} },
      }),
    ).rejects.toMatchObject({
      response: { status: 401 },
    });

    expect(signOut).toHaveBeenCalled();
  });

  test('does not sign out when the refresh attempt throws', async () => {
    const api = jest.fn();

    (attemptRefreshingSession as jest.Mock).mockRejectedValue(new Error('temporary outage'));

    await expect(
      createResponseErrorHandler(api)({
        response: { status: 401 },
        config: { headers: {} },
      }),
    ).rejects.toMatchObject({
      response: { status: 401 },
    });

    expect(signOut).not.toHaveBeenCalled();
  });
});
