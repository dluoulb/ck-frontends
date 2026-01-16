import { AnalyticsBrowser } from '@customerio/cdp-analytics-browser';

const CUSTOMERIO_WRITE_KEY = process.env.NEXT_PUBLIC_CUSTOMERIO_WRITE_KEY;

let customerIO: AnalyticsBrowser | null = null;

export const initializeCustomerio = () => {
  if (!CUSTOMERIO_WRITE_KEY) {
    console.warn('CustomerIO credentials not found. Please set NEXT_PUBLIC_CUSTOMERIO_WRITE_KEY');
    return null;
  }

  if (!customerIO) {
    customerIO = AnalyticsBrowser.load({ writeKey: CUSTOMERIO_WRITE_KEY });
  }

  return customerIO;
};

export const getCustomerio = () => {
  if (!customerIO) {
    return initializeCustomerio();
  }
  return customerIO;
};

export const identifyUser = (user: any) => {
  const cio = getCustomerio();
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
