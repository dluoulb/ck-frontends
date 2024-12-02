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
    this.init();
  }

  initialized() {
    return process.env.NEXT_PUBLIC_ENV === 'test' ? true : isInitialized();
  }

  init() {
    initFullStory({
      orgId: 'Y34CM',
      devMode: process.env.NEXT_PUBLIC_ENV !== 'production',
      recordCrossDomainIFrames: iframedMerchants.includes(this.merchantName)
        ? true
        : false,
      recordOnlyThisIFrame: iframedMerchants.includes(this.merchantName)
        ? true
        : false,
    });
  }

  identifyUser(id: string, vars: Record<string, any> = {}) {
    if (process.env.NEXT_PUBLIC_ENV !== 'production') return;

    FS('setIdentity', {
      uid: id,
      properties: vars,
    });
  }

  trackEvent({
    merchant = {},
    session = {},
    user = {},
    shopping_cart = {},
    company = {},
  }: {
    merchant?: any;
    session?: any;
    user?: any;
    shopping_cart?: any;
    company?: any;
  }) {
    if (process.env.NEXT_PUBLIC_ENV !== 'production') return;

    const eventDetails = {
      order_amount: session?.hasShoppingCart ? shopping_cart?.grand_total : '',
      merchant_public_key: merchant?.public_key,
      merchant_name: merchant?.name,
      session_type: session?.session_type,
      email: user?.email,
      fico: company?.applicant_fico_score,
      underwriting_status: company?.underwriting_status,
      tier: company?.tier,
      tcl: company?.credit_line?.get('amount') || 0,
      reason: company?.short_display,
    };

    switch (this.component) {
      case 'newuser':
        FS('trackEvent', {
          name: 'New User',
          properties: eventDetails,
        });
        break;
      case 'existinguser':
        FS('trackEvent', {
          name: 'Existing User',
          properties: eventDetails,
        });
        break;
      case 'declinedonreapply':
        FS('trackEvent', {
          name: 'Declined on Reapply',
          properties: eventDetails,
        });
        break;
      case 'declined':
        FS('trackEvent', {
          name: 'Decline',
          properties: eventDetails,
        });
        break;
      case 'pending':
        FS('trackEvent', {
          name: 'Pend',
          properties: eventDetails,
        });
        break;
      case 'terms':
        FS('trackEvent', {
          name: 'Terms',
          properties: eventDetails,
        });
        break;
      default:
        return null;
    }
  }
}

RollbarFullStory.init(rollbarConfig);
