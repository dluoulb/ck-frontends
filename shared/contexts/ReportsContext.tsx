import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import { useUser } from '@contexts/UserContext';
import useApi from '@hooks/useApi';
import useApplications from '@hooks/useApplications';
import useDocuments from '@hooks/useDocuments';
import useStats from '@hooks/useStats';
import { getUser } from '@lib/actions/users';

const ReportsContext = createContext(null);

export const ReportsContextProvider = ({
  entity,
  entityLoading,
  content = null,
  children,
}) => {
  const api = useApi();
  const { user } = useUser();
  const { type } = useRouter().query;

  const [isLoading, setIsLoading] = useState(false);
  const userId = type === 'accounts' ? entity?.user?.id : entity?.borrower?.id;

  const { data: owner, isLoading: ownerLoading } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => getUser(api, userId),
    enabled: !!entity && !!userId && content === 'dashboard',
    retry: 1,
  });

  const stats = useStats(entity);
  const documents = useDocuments(entity);

  const { applications, applicationsError, applicationsLoading } =
    useApplications(entity, content);

  const sortedApps = Array.isArray(applications)
    ? applications.sort(
        (a, b) =>
          new Date(b.attributes.created_at).getTime() -
          new Date(a.attributes.created_at).getTime()
      )
    : [];

  useEffect(() => {
    setIsLoading(
      !user ||
        entityLoading ||
        ownerLoading ||
        applicationsLoading ||
        stats?.statsLoading ||
        documents?.documentsLoading
    );
  }, [
    user,
    entityLoading,
    ownerLoading,
    applicationsLoading,
    stats?.statsLoading,
    documents?.documentsLoading,
  ]);

  const dependencies = {
    isLoading,
    entity,
    entityLoading,
    ...stats,
    ...documents,
    ownerAddress: owner?.address,
    applications: sortedApps?.map((app) => app.attributes),
    applicationsError,
    applicationsLoading,
  };

  return (
    <ReportsContext.Provider value={dependencies}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReportsDeps = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error(
      'useReportsDeps must be used within a ReportsContextProvider'
    );
  }
  return context;
};
