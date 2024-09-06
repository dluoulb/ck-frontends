import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import useApi from '@hooks/useApi';
import { getApplications, getDocuments, getStats } from '@lib/actions/entities';
import { getUser } from '@lib/actions/users';

function useEntityDependencies(entity, content) {
  let entityProps;
  const api = useApi();
  const { type } = useRouter().query;
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fetchConfig = {
    enabled: !!entity && !entityProps && content !== 'orders',
    retry: false,
  };

  const controller = type === 'accounts' ? 'pi4' : null;
  const userId = type === 'accounts' ? entity?.user?.id : entity?.borrower?.id;
  const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ['users', entity?.id],
    queryFn: () => getUser(api, controller, userId),
    ...fetchConfig,
  });

  const {
    data: applications,
    error: applicationsError,
    isLoading: applicationsLoading,
  } = useQuery({
    queryKey: ['applications', entity?.id],
    queryFn: () => getApplications(api, entity),
    ...fetchConfig,
  });

  const {
    data: stats,
    error: statsError,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ['stats', entity?.id],
    queryFn: () => getStats(api, entity),
    enabled: !!entity,
    retry: 1,
  });

  const {
    data: documents,
    error: documentsError,
    isLoading: documentsLoading,
  } = useQuery({
    queryKey: ['documents', entity?.id],
    queryFn: () => getDocuments(api, entity),
    ...fetchConfig,
  });

  useEffect(() => {
    if (userError || applicationsError || statsError || documentsError)
      setHasErrors(true);
  }, [userError, applicationsError, statsError, documentsError]);

  useEffect(() => {
    setIsLoading(
      userLoading || applicationsLoading || statsLoading || documentsLoading
    );
  }, [userLoading, applicationsLoading, statsLoading, documentsLoading]);

  const errors = {
    userError,
    applicationsError,
    statsError,
    documentError: documentsError,
  };

  entityProps = {
    type: type === 'accounts' ? 'account' : 'company',
    entity,
    ownerAddress: user?.address,
    applications: applications?.map((app) => app.attributes),
    stats: stats,
    documents,
    errors,
    hasErrors,
    isLoading,
  };

  return { entityProps };
}

export default useEntityDependencies;
