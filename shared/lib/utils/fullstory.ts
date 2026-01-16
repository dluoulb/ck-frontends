import RollbarFullStory from '@bharathvaj/fullstory-rollbar';
import { FullStory as FS, init as initFullStory, isInitialized } from '@fullstory/browser';

import { platform } from '@lib/constants/SiteVariables';
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
    return platform() === 'test' ? true : isInitialized();
  }

  init() {
    initFullStory({
      orgId: process.env.NEXT_PUBLIC_FULLSTORY_ORG_ID,
      devMode: platform() !== 'production',
      debug: platform() !== 'production',
      recordCrossDomainIFrames: iframedMerchants.includes(this.merchantName) ? true : false,
      recordOnlyThisIFrame: iframedMerchants.includes(this.merchantName) ? true : false,
    });
  }

  identifyUser(id: string, vars: Record<string, any> = {}) {
    FS('setIdentity', {
      uid: id,
      properties: vars,
    });
  }

  trackEvent(name: string, properties: any = {}) {
    FS('trackEvent', {
      name,
      properties,
    });
  }

  bpEvent(email: string) {
    this.trackEvent('Borrower Portal', { email });
  }

  activateCardEvent(userId: string, companyId: string) {
    this.trackEvent('Activate Card', { companyId, userId });
  }

  agreeVcRulesEvent(userId: string, companyId: string) {
    this.trackEvent('Agreed to VC Rules', { companyId, userId });
  }

  acceptCardholderAgreementEvent(userId: string, companyId: string) {
    this.trackEvent('Accepted Cardholder Agreement', { companyId, userId });
  }

  newPaymentMethodEvent(userId: string, companyId: string) {
    this.trackEvent('Created New Payment Method', { companyId, userId });
  }

  setDefaultTermsEvent(userId: string, companyId: string, months: number) {
    this.trackEvent('Select Default Payment Terms', {
      companyId,
      userId,
      months,
    });
  }

  initiateAddFundsEvent(userId: string, companyId: string) {
    this.trackEvent('Clicked Add Funds to Card', { companyId, userId });
  }

  addFundsToCardEvent(userId: string, companyId: string, amount: string) {
    this.trackEvent('Added Funds', { companyId, userId, amount });
  }

  confirmMailingAddressEvent(userId: string, companyId: string) {
    this.trackEvent('Confirmed Mailing Address', { companyId, userId });
  }

  viewedPlusSubscriptionModalEvent(userId: string, companyId: string) {
    this.trackEvent('Viewed Plus Subscription Modal', { companyId, userId });
  }

  plusSubscriptionSuccessfulEvent(userId: string, companyId: string, planType: string) {
    this.trackEvent('Plus Subscription Successful', {
      companyId,
      userId,
      planType,
    });
  }
}

// TODO fix!
// RollbarFullStory.init(rollbarConfig);
