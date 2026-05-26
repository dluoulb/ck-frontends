import type { Analytics } from '@customerio/cdp-analytics-browser';

const CUSTOMERIO_WRITE_KEY = process.env.NEXT_PUBLIC_CUSTOMERIO_WRITE_KEY;

let customerIO: Analytics | null = null;

const getOrInitCustomerIO = async (): Promise<Analytics | null> => {
  if (typeof window === 'undefined') return null;

  if (!CUSTOMERIO_WRITE_KEY) {
    console.warn('CustomerIO credentials not found. Please set NEXT_PUBLIC_CUSTOMERIO_WRITE_KEY');
    return null;
  }

  if (!customerIO) {
    const { AnalyticsBrowser } = await import('@customerio/cdp-analytics-browser');
    const [analytics] = await AnalyticsBrowser.load({ writeKey: CUSTOMERIO_WRITE_KEY });
    customerIO = analytics;
  }

  return customerIO;
};

export const identifyUser = async (user: any) => {
  const cio = await getOrInitCustomerIO();
  if (!cio || !user) {
    console.warn('CustomerIO not initialized or missing user');
    return;
  }

  try {
    cio.identify(user.id);
  } catch (error) {
    console.error('Error identifying user with CustomerIO:', error);
  }
};
