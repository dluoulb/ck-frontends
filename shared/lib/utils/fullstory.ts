import RollbarFullStory from '@bharathvaj/fullstory-rollbar';
import {
  FullStory as FS,
  init as initFullStory,
  isInitialized,
} from '@fullstory/browser';

import { rollbarConfig } from './rollbar';

const iframedMerchants = ['chargeafter', 'samsung', 'lenovo'];

interface Merchant {
  name?: string;
  public_key?: string;
}

export default class FullStory {
  private component: string;
  private merchantName: string;

  constructor(component: string = '', merchant: Merchant = {}) {
    this.component = component.toLowerCase();
    this.merchantName = merchant.name?.toLowerCase() || '';
  }

  initialized() {
    return process.env.NEXT_PUBLIC_ENV === 'test' ? true : isInitialized();
  }

  init() {
    initFullStory({
      orgId: process.env.NEXT_PUBLIC_FULLSTORY_ORG_ID,
      devMode: process.env.NEXT_PUBLIC_ENV !== 'production',
      debug: process.env.NEXT_PUBLIC_ENV !== 'production',
      recordCrossDomainIFrames: iframedMerchants.includes(this.merchantName)
        ? true
        : false,
      recordOnlyThisIFrame: iframedMerchants.includes(this.merchantName)
        ? true
        : false,
    });
  }

  identifyUser(id: string, vars: Record<string, any> = {}) {
    FS('setIdentity', {
      uid: id,
      properties: vars,
    });
  }

  trackEvent({ user = {} }: { user?: any }) {
    FS('trackEvent', {
      name: 'Borrower Portal',
      properties: { email: user.email },
    });
  }
}

// TODO fix!
// RollbarFullStory.init(rollbarConfig);
