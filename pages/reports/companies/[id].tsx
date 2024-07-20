import { useContext } from 'react';
import Loading from '@components/Loading';
import EntityDetail from '@reports/entity/EntityDetail';
import NoDataError from '@reports/NoDataError';
import { useQuery } from '@tanstack/react-query';
import { ApiContext } from 'contexts';
import { getCompany } from 'lib/actions/companies';
import { useRouter } from 'next/router';
import useCompanyDependencies from 'pages/reports/hooks/useCompanyDependencies';

const CompanyIndex = () => {
  const router = useRouter();
  const api = useContext(ApiContext);
  const { id } = router.query;

  const {
    data: company,
    error: companyError,
    isLoading: companyLoading,
  } = useQuery({
    queryKey: ['company', id],
    queryFn: () => getCompany(api, id),
    enabled: !!id,
    retry: false,
  });

  const {
    companyProps: { isLoading },
    companyProps,
  } = useCompanyDependencies(company);

  if (companyError) return <NoDataError tag="Company" />;

  if (companyLoading || isLoading)
    return <Loading className="w-14 h-14 my-16" />;

  return (
    <div className="max-w-[90%] mx-auto">
      <EntityDetail props={companyProps} />
    </div>
  );
};

export default CompanyIndex;
