import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import Loading from '@components/Loading';
import EntityDetail from '@reports/entity_detail/EntityDetail';
import NoDataError from '@reports/NoDataError';
import useApi from 'hooks/useApi';
import useEntityDependencies from '../hooks/useEntityDependencies';
import { getAccount, getCompany } from 'lib/actions/entities';

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

  if (entityError) {
    return <NoDataError tag={entity?.type} />;
  }

  if (entityLoading || isLoading) {
    return <Loading className="w-14 h-14 my-16" />;
  }

  return (
    <div className="max-w-[90%] mx-auto">
      <EntityDetail
        props={entityProps}
        content={queryContent}
        setContent={setQueryContent}
      />
    </div>
  );
}
