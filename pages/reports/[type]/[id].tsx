import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import EntityDetail from '@apps/reports/components/entity_detail/EntityDetail';
import useEntityDependencies from '@apps/reports/hooks/useEntityDependencies';
import Loading from '@components/Loading';
import NoDataError from '@components/NoDataError';
import useApi from '@hooks/useApi';
import { getCompany } from '@lib/actions/companies';
import { getAccount } from '@lib/actions/entities';

export default function EntityIndex() {
  const api = useApi();
  const { id, type, content } = useRouter().query;
  const [queryContent, setQueryContent] = useState(null);

  const fetchEntity = (api, id) => {
    if (type === 'accounts') {
      return getAccount(api, id);
    } else {
      return getCompany(api, id);
    }
  };

  const {
    data: entity,
    error: entityError,
    isLoading: entityLoading,
  } = useQuery({
    queryKey: [type, id],
    queryFn: () => fetchEntity(api, id),
    enabled: !!id,
    retry: 1,
  });

  const {
    entityProps: { isLoading },
    entityProps,
  } = useEntityDependencies(entity, content);

  useEffect(() => {
    setQueryContent(content);
  }, [content]);

  if ((!entity && !entityLoading) || entityError) {
    return (
      <NoDataError
        tag={type === 'accounts' ? 'Account' : 'Company'}
        withButton={true}
      />
    );
  }

  if (entityLoading || isLoading) {
    return <Loading className="w-14 h-14 my-16" />;
  }

  return (
    <div data-testid="container" className="max-w-[90%] mx-auto">
      <EntityDetail
        props={entityProps}
        content={queryContent}
        setContent={setQueryContent}
      />
    </div>
  );
}
