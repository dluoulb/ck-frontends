import classNames from 'classnames';

const protocol = 'https://';
const rootURI = 'creditkey.com';

export const USE_SUPERTOKENS = process.env.REACT_APP_USE_SUPERTOKENS === 'true';

export const platform = () => {
  if (process.env.NODE_ENV !== 'production') {
    return 'development';
  } else if (window.location && window.location.hostname.match(/staging/i)) {
    return 'staging';
  }

  return 'production';
};

export const server = (api = true) => {
  if (process.env && process.env.NODE_ENV !== 'production') {
    return process.env.REACT_APP_CK_WEB_VIRTUAL_HOST || 'http://localhost:9100';
  }

  let subDomain = 'www';
  if (window.location && window.location.hostname.match(/staging/i)) {
    subDomain = 'staging';
  }

  const baseURI = protocol + subDomain + '.' + rootURI;

  return api ? `${baseURI}/app` : baseURI;
};

export const supportPhone = '+1 (844) 334-3636';
export const declinedSupportPhone = '+1 (844) 900-3330';

export const formStyles = {
  error: (error) =>
    classNames('input focus:border-primary-blue', {
      '!border-error': error,
    }),
  input: (multi, error) =>
    classNames('w-full', multi ? 'mb-2 sm:mb-2' : 'mb-2 ', {
      'mb-0 sm:mb-2': error,
    }),
  validation: 'text-error text-xxs sm:text-xs text-left',
};

export const supportLink = 'https://creditkey.zendesk.com/hc/en-us';
export const ckaLink = 'https://www.creditkey.com/anywhere';
export const virtualCardLink =
  'https://creditkey.zendesk.com/hc/en-us/articles/360060554031-How-can-I-use-the-Credit-Key-Virtual-Card-';

export const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
