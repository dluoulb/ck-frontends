import React, { useMemo } from 'react';

import Loading from '@components/Loading';
import { useEntity } from '@contexts/EntityContext';
import useModal from '@hooks/useModal';
import {
  useActiveSubscription,
  useCreateSubscription,
} from '@hooks/useSubscription';
import ActivationModal from './ActivationModal';
import Banner from './Banner';
import Benefits from './Benefits';
import ComparisonTable from './ComparisonTable';
import CTA from './CTA';
import FAQs from './FAQs';
import SubscriberOverview from './SubscriberOverview';

export default function Plus() {
  const { entity } = useEntity();
  const {
    isModalActive: isActivationModalActive,
    toggleModal: toggleActivationModal,
  } = useModal();

  const {
    activeSubscription,
    activeSubscriptionLoading,
    refetchActiveSubscription,
  } = useActiveSubscription(entity?.id);

  const { createSubscriptionLoading, createSubscription } =
    useCreateSubscription();

  const handleJoinClick = () => {
    toggleActivationModal();
  };

  const handleActivate = async (planType: string) => {
    await createSubscription({ planType, companyId: entity?.id });
    await refetchActiveSubscription();
    toggleActivationModal();
  };

  if (activeSubscriptionLoading) {
    return <Loading className="w-14 h-14 my-20" />;
  }

  return (
    <div
      data-testid="plus-container"
      className="my-4 md:my-6 mx-auto h-full xl:max-w-[90%]"
      role={Plus.role}
    >
      <h1 className="text-2xl font-bold text-primary capitalize">
        Credit Key Plus
      </h1>
      {activeSubscription && (
        <SubscriberOverview subscription={activeSubscription} />
      )}
      {!activeSubscription && <Banner onJoinClick={handleJoinClick} />}
      <Benefits />
      {!activeSubscription && <ComparisonTable />}
      {!activeSubscription && <CTA onJoinClick={handleJoinClick} />}
      <FAQs />

      <ActivationModal
        isModalActive={isActivationModalActive}
        createSubscriptionLoading={createSubscriptionLoading}
        toggleModal={toggleActivationModal}
        onActivate={handleActivate}
      />
    </div>
  );
}

Plus.role = 'plus-page';
