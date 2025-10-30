import { AxiosInstance } from 'axios';

import SubscriptionRecord from '@lib/records/subscription';
import SubscriptionPlanRecord from '@lib/records/subscription_plan';

export const getSubscriptionPlans = async (api: AxiosInstance) => {
  const response = await api.get(`/api/subscription_plans`);

  return (
    response?.data?.data.map(
      (plan) => new SubscriptionPlanRecord(plan.attributes)
    ) ?? []
  );
};

export const getSubscriptions = async (
  api: AxiosInstance,
  companyId: string
) => {
  const response = await api.get(`/api/subscriptions?company_id=${companyId}`);

  return (
    response?.data?.data?.map(
      (subscription) => new SubscriptionRecord(subscription.attributes)
    ) ?? []
  );
};

export const getActiveSubscription = async (
  api: AxiosInstance,
  companyId: string
) => {
  const response = await api.get(
    `/api/subscriptions/active?company_id=${companyId}`
  );

  if (response?.data?.data) {
    return new SubscriptionRecord(response.data.data.attributes);
  }

  return null;
};

export const createSubscription = async (
  api: AxiosInstance,
  planType: string,
  companyId: string
) => {
  const response = await api.post('/api/subscriptions', {
    plan_type: planType,
    company_id: companyId,
  });

  if (response?.data?.data) {
    return new SubscriptionRecord(response.data.data.attributes);
  }

  return null;
};
