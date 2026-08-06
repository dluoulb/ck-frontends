import type { Analytics } from '@customerio/cdp-analytics-browser';

const CUSTOMERIO_WRITE_KEY = process.env.NEXT_PUBLIC_CUSTOMERIO_WRITE_KEY;
const CUSTOMERIO_INIT_OPTIONS = { useQueryString: false } as const;

let customerIO: Analytics | null = null;
let customerIOInitPromise: Promise<Analytics | null> | null = null;
let customerIOGeneration = 0;

const getOrInitCustomerIO = async (): Promise<Analytics | null> => {
  if (typeof window === 'undefined') return null;

  if (!CUSTOMERIO_WRITE_KEY) {
    console.warn('CustomerIO credentials not found. Please set NEXT_PUBLIC_CUSTOMERIO_WRITE_KEY');
    return null;
  }

  if (!customerIO) {
    if (!customerIOInitPromise) {
      customerIOInitPromise = (async () => {
        const { AnalyticsBrowser } = await import('@customerio/cdp-analytics-browser');
        const [analytics] = await AnalyticsBrowser.load(
          { writeKey: CUSTOMERIO_WRITE_KEY },
          CUSTOMERIO_INIT_OPTIONS,
        );
        customerIO = analytics;
        return analytics;
      })();
    }

    customerIO = await customerIOInitPromise;
    customerIOInitPromise = null;
  }

  return customerIO;
};

export const identifyUser = async (user: any) => {
  const generationAtStart = customerIOGeneration;
  const cio = await getOrInitCustomerIO();
  if (!cio || !user) {
    console.warn('CustomerIO not initialized or missing user');
    return;
  }

  if (generationAtStart !== customerIOGeneration) return;

  try {
    // Clear any persisted anonymous or prior-user state before identifying the signed-in user.
    cio.reset();
    cio.identify(user.id);
  } catch (error) {
    console.error('Error identifying user with CustomerIO:', error);
  }
};

export const resetCustomerIO = async () => {
  const generationAtStart = ++customerIOGeneration;
  const cio = customerIO ?? (await customerIOInitPromise);

  try {
    cio?.reset();
  } catch (error) {
    console.error('Error resetting CustomerIO:', error);
  } finally {
    if (generationAtStart === customerIOGeneration) {
      customerIO = null;
      customerIOInitPromise = null;
    }
  }
};
