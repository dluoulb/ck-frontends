import { AnalyticsBrowser } from '@customerio/cdp-analytics-browser';

const CUSTOMERIO_WRITE_KEY = process.env.NEXT_PUBLIC_CUSTOMERIO_WRITE_KEY;

let customerIO: AnalyticsBrowser | null = null;

export const initializeCustomerio = () => {
  if (!CUSTOMERIO_WRITE_KEY) {
    console.warn(
      'CustomerIO credentials not found. Please set NEXT_PUBLIC_CUSTOMERIO_WRITE_KEY'
    );
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

export const identifyUser = (user: any, entity: any) => {
  const cio = getCustomerio();
  if (!cio || !user || !entity) {
    console.warn('CustomerIO not initialized or missing user/company data');
    return;
  }

  try {
    const traits = {
      companyId: entity.id,
      companyName: entity.name,
      firstName: user.first_name,
      lastName: user.last_name,
      isBankConnected: entity.is_bank_connected,
      isVirtualCardEnabled: entity.vc_enabled,
      phone: user.phone_number,
      underwritingStatus: entity.underwriting_status,
      latestApprovalDate: entity.latest_approval_date,
      isPastDue: entity.is_past_due,
      approvedCreditLimit: entity.credit_line?.amount,
      remainingAmount: entity.credit_line?.remaining_amount,
      vcSublimit: entity.vc_sub_limits?.limit_amount,
      vcSublimitRemaining: entity.vc_sub_limits?.remaining_limit_amount,
      tier: entity.tier,
      totalOrdersCount: entity.orders_count || 0,
    };

    cio.identify(user.id, traits);
  } catch (error) {
    console.error('Error identifying user with CustomerIO:', error);
  }
};
