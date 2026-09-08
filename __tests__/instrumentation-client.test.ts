export {};

jest.mock('posthog-js', () => ({
  __esModule: true,
  default: {
    __loaded: false,
    init: jest.fn(),
  },
}));

const originalPosthogToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;

const loadInstrumentationClient = () => {
  jest.resetModules();
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN = 'test-token';

  const posthog = require('posthog-js').default;
  posthog.__loaded = false;

  require('../instrumentation-client');

  return posthog;
};

describe('instrumentation-client PostHog init', () => {
  afterEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  afterAll(() => {
    if (originalPosthogToken === undefined) {
      delete process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
      return;
    }

    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN = originalPosthogToken;
  });

  test('captures from the first event for a normal borrower session (before_send + recording on)', () => {
    const posthog = loadInstrumentationClient();

    expect(posthog.init).toHaveBeenCalledWith(
      'test-token',
      expect.objectContaining({
        autocapture: true,
        before_send: expect.any(Function),
        disable_session_recording: false,
      }),
    );
  });

  test('suppresses an impersonated session before init via the sessionStorage marker', () => {
    sessionStorage.setItem('parentUserId', 'admin-1');
    const posthog = loadInstrumentationClient();

    expect(posthog.init).toHaveBeenCalledWith(
      'test-token',
      expect.objectContaining({
        disable_session_recording: true,
      }),
    );
  });
});
