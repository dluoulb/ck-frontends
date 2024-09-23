import { useQuery } from '@tanstack/react-query';

import useApi from '@hooks/useApi';
import { getDocuments } from '@lib/actions/entities';

function useDocuments(entity) {
  const api = useApi();

  const {
    data: documents,
    error: documentsError,
    isLoading: documentsLoading,
  } = useQuery({
    queryKey: ['documents', entity?.id],
    queryFn: () => getDocuments(api, entity),
    enabled: !!entity,
    retry: false,
  });

  return {
    documents,
    documentsError,
    documentsLoading,
  };
}
export default useDocuments;
