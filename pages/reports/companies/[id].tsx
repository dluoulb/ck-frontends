import { useContext, useState } from 'react';
import Loading from '@components/Loading';
import EntityDetail from '@reports/entity_detail/EntityDetail';
import NoDataError from '@reports/NoDataError';
import { useQuery } from '@tanstack/react-query';
import { ApiContext } from 'contexts';
import { getCompany } from 'lib/actions/companies';
import { useRouter } from 'next/router';
import useCompanyDependencies from 'pages/reports/hooks/useCompanyDependencies';

const CompanyIndex = () => {
  const api = useContext(ApiContext);
  const { query } = useRouter();
  const [content, setContent] = useState(query?.content);

  const {
    data: company,
    error: companyError,
    isLoading: companyLoading,
  } = useQuery({
    queryKey: ['company', query.id],
    queryFn: () => getCompany(api, query.id),
    enabled: !!query.id,
    retry: false,
  });

  const {
    companyProps: { isLoading },
    companyProps,
  } = useCompanyDependencies(company, content);

  if (companyError) return <NoDataError tag="Company" />;

  if (companyLoading || isLoading)
    return <Loading className="w-14 h-14 my-16" />;

  return (
    <div className="max-w-[90%] mx-auto">
      <EntityDetail
        props={companyProps}
        content={content}
        setContent={setContent}
      />
    </div>
  );
};

export default CompanyIndex;
