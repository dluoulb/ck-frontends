jest.mock('posthog-js', () => ({
  __esModule: true,
  default: {
    capture: jest.fn(),
    identify: jest.fn(),
    reset: jest.fn(),
    startSessionRecording: jest.fn(),
    stopSessionRecording: jest.fn(),
  },
}));

const originalPosthogToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

const loadPosthogModule = () => {
  jest.resetModules();
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN = 'test-token';

  const posthog = require('posthog-js').default;
  const posthogLib = require('@lib/posthog');

  return {
    posthog,
    captureEvent: posthogLib.captureEvent as (event: string) => void,
    resetPostHog: posthogLib.resetPostHog as () => void,
    setPosthogSessionOptOut: posthogLib.setPosthogSessionOptOut as (
      shouldSuppress: boolean,
    ) => void,
    posthogBeforeSend: posthogLib.posthogBeforeSend as (event: unknown) => unknown,
    initSessionSuppression: posthogLib.initSessionSuppression as () => boolean,
  };
};

describe('posthog session opt-out', () => {
  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    localStorage.clear();
  });

  afterAll(() => {
    if (originalPosthogToken === undefined) {
      delete process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
      return;
    }

    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN = originalPosthogToken;
  });

  test.each(['admin', 'impersonated'])(
    'drops events (via before_send) and stops session recording for %s sessions',
    (_sessionType) => {
      const { posthog, setPosthogSessionOptOut, posthogBeforeSend } = loadPosthogModule();

      setPosthogSessionOptOut(true);

      expect(posthogBeforeSend({ event: 'virtual_card_viewed' })).toBeNull();
      expect(posthog.stopSessionRecording).toHaveBeenCalledTimes(1);
      expect(posthog.startSessionRecording).not.toHaveBeenCalled();
    },
  );

  test('forwards events and starts session recording for normal borrower sessions', () => {
    const { posthog, setPosthogSessionOptOut, posthogBeforeSend } = loadPosthogModule();

    setPosthogSessionOptOut(false);

    const event = { event: 'virtual_card_viewed' };
    expect(posthogBeforeSend(event)).toBe(event);
    expect(posthog.startSessionRecording).toHaveBeenCalledTimes(1);
    expect(posthog.stopSessionRecording).not.toHaveBeenCalled();
  });

  test('initSessionSuppression suppresses impersonated sessions from the sessionStorage marker', () => {
    sessionStorage.setItem('parentUserId', 'admin-1');
    const { posthogBeforeSend, initSessionSuppression } = loadPosthogModule();

    expect(initSessionSuppression()).toBe(true);
    expect(posthogBeforeSend({ event: 'virtual_card_viewed' })).toBeNull();
  });

  test('initSessionSuppression leaves normal borrower sessions capturing', () => {
    const { posthogBeforeSend, initSessionSuppression } = loadPosthogModule();

    expect(initSessionSuppression()).toBe(false);
    const event = { event: 'virtual_card_viewed' };
    expect(posthogBeforeSend(event)).toBe(event);
  });

  test('initSessionSuppression defaults to capturing when sessionStorage access throws', () => {
    const getItem = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked');
    });
    const { posthogBeforeSend, initSessionSuppression } = loadPosthogModule();

    expect(initSessionSuppression()).toBe(false);
    const event = { event: 'virtual_card_viewed' };
    expect(posthogBeforeSend(event)).toBe(event);

    getItem.mockRestore();
  });

  test('captureEvent forwards events to PostHog (before_send enforces the opt-out itself)', () => {
    const { posthog, captureEvent } = loadPosthogModule();

    captureEvent('virtual_card_viewed');

    expect(posthog.capture).toHaveBeenCalledWith('virtual_card_viewed', undefined);
  });

  test('reset returns the session to suppressed', () => {
    const { posthog, resetPostHog, setPosthogSessionOptOut, posthogBeforeSend } =
      loadPosthogModule();

    setPosthogSessionOptOut(false);
    resetPostHog();

    expect(posthog.reset).toHaveBeenCalledTimes(1);
    expect(posthog.stopSessionRecording).toHaveBeenCalledTimes(1);
    expect(posthogBeforeSend({ event: 'virtual_card_viewed' })).toBeNull();
  });

  test('reset still suppresses the session when reset throws', () => {
    const { posthog, resetPostHog, setPosthogSessionOptOut, posthogBeforeSend } =
      loadPosthogModule();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    setPosthogSessionOptOut(false);
    posthog.reset.mockImplementationOnce(() => {
      throw new Error('reset failed');
    });

    resetPostHog();

    expect(posthog.reset).toHaveBeenCalledTimes(1);
    expect(posthogBeforeSend({ event: 'virtual_card_viewed' })).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error resetting PostHog:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});
