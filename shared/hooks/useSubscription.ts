import { useMutation, useQuery } from '@tanstack/react-query';

import useApi from '@hooks/useApi';
import {
  createSubscription as createSubscriptionAction,
  getActiveSubscription as getActiveSubscriptionAction,
  getSubscriptionPlans,
  getSubscriptions,
} from '@lib/actions/plus';
import SubscriptionRecord from '@lib/records/subscription';
import SubscriptionPlanRecord from '@lib/records/subscription_plan';

type CreateSubscriptionVariables = {
  planType: string;
  companyId: string;
};

export function useSubscriptions(companyId: string) {
  const api = useApi();

  const {
    data,
    error: subscriptionsError,
    isPending: subscriptionsLoading,
    refetch,
  } = useQuery({
    queryKey: ['subscriptions', companyId],
    queryFn: () => getSubscriptions(api, companyId as string),
    enabled: !!companyId,
    retry: 1,
  });

  const subscriptions: SubscriptionRecord[] = data ?? [];

  return {
    subscriptions,
    subscriptionsError,
    subscriptionsLoading,
    refetchSubscriptions: refetch,
  };
}

export function useSubscriptionPlans() {
  const api = useApi();

  const {
    data,
    error: subscriptionPlansError,
    isLoading: subscriptionPlansLoading,
    refetch,
  } = useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: () => getSubscriptionPlans(api),
    retry: 1,
  });

  const subscriptionPlans: SubscriptionPlanRecord[] = data ?? [];

  return {
    subscriptionPlans,
    subscriptionPlansError,
    subscriptionPlansLoading,
    refetchSubscriptionPlans: refetch,
  };
}

export function useActiveSubscription(companyId: string) {
  const api = useApi();

  const {
    data: activeSubscription,
    error: activeSubscriptionError,
    isPending: activeSubscriptionLoading,
    refetch: refetchActiveSubscription,
  } = useQuery({
    queryKey: ['activeSubscription', companyId],
    queryFn: () => getActiveSubscriptionAction(api, companyId),
    enabled: !!companyId,
    retry: 1,
  });

  return {
    activeSubscription,
    activeSubscriptionError,
    activeSubscriptionLoading,
    refetchActiveSubscription,
  };
}

export function useCreateSubscription() {
  const api = useApi();

  const {
    mutateAsync: createSubscription,
    error: createSubscriptionError,
    isPending: createSubscriptionLoading,
  } = useMutation<SubscriptionRecord | null, unknown, CreateSubscriptionVariables>({
    mutationFn: ({ planType, companyId }) => createSubscriptionAction(api, planType, companyId),
  });

  return {
    createSubscription,
    createSubscriptionError,
    createSubscriptionLoading,
  };
}
