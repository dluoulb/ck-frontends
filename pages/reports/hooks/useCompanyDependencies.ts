import { useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiContext } from 'contexts';

import {
  getCompanyApplications,
  getCompanyDocuments,
  getCompanyStats,
} from '../../../lib/actions/companies';
import { getUser } from '../../../lib/actions/users';

function useCompanyDependencies(company, content) {
  let companyProps;
  const api = useContext(ApiContext);
  const [hasErrors, setHasErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fetchConfig = {
    enabled: !!company && !companyProps && content !== 'orders',
    retry: false,
  };

  const {
    data: user,
    error: userError,
    isLoading: userLoading,
  } = useQuery({
    queryKey: ['users', company?.id],
    queryFn: () => getUser(api, company?.borrower.id),
    ...fetchConfig,
  });

  const {
    data: applications,
    error: applicationsError,
    isLoading: applicationsLoading,
  } = useQuery({
    queryKey: ['applications', company?.id],
    queryFn: () => getCompanyApplications(api, company),
    ...fetchConfig,
  });

  const {
    data: stats,
    error: statsError,
    isLoading: statsLoading,
  } = useQuery({
    queryKey: ['stats', company?.id],
    queryFn: () => getCompanyStats(api, company?.id),
    ...fetchConfig,
  });

  const {
    data: companyDocs,
    error: companyDocsError,
    isLoading: companyDocsLoading,
  } = useQuery({
    queryKey: ['companyDocs', company?.id],
    queryFn: () => getCompanyDocuments(api, company),
    ...fetchConfig,
  });

  useEffect(() => {
    if (userError || applicationsError || statsError || companyDocsError)
      setHasErrors(true);
  }, [userError, applicationsError, statsError, companyDocsError]);

  useEffect(() => {
    setIsLoading(userLoading || applicationsLoading || statsLoading || companyDocsLoading);
  }, [userLoading, statsLoading, companyDocsLoading]);

  const errors = {
    userError,
    applicationsError,
    statsError,
    documentError: companyDocsError,
  };

  companyProps = {
    type: 'company',
    entity: company,
    ownerAddress: user?.attributes?.address,
    applications: applications?.map((app) => app.attributes),
    stats: stats,
    documents: companyDocs,
    errors,
    hasErrors,
    isLoading,
  };

  return { companyProps };
}

export default useCompanyDependencies;
