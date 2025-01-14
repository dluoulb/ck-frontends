import { platform } from '@lib/constants/SiteVariables';

const debugPlatforms = ['staging', 'production'];

// TOOD: Check if there is a better error handling software
// OR deep dive into rollbar config for better stack tracing
// to better fit Credit Key needs
export const rollbarConfig = {
  enabled: debugPlatforms.includes(platform()),
  // TOOD: needs to handle diff Rollbar tokens for each app
  accessToken: process.env.NEXT_PUBLIC_ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  environment: platform(),
  code_version: '0.13.7',
  payload: {
    source_map_enabled: true,
    environment: platform(),
    guess_uncaught_frames: true,
  },
  transform: function (payload: any) {
    if (window?.FS && window?.FS?.getCurrentSessionURL) {
      payload.fullstorysessionURL = window.FS.getCurrentSessionURL(true);
    }
    return payload;
  },
};
