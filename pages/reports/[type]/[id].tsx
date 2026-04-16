import { useState } from 'react';
import { useRouter } from 'next/router';

import EntityDetail from '@apps/reports/components/entity_detail/EntityDetail';
import NoDataError from '@components/NoDataError';
import { useEntity } from '@contexts/EntityContext';
import { ReportsContextProvider } from '@contexts/ReportsContext';

export default function EntityIndex() {
  const { id, type, content } = useRouter().query;
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  const { entity, entityError, entityLoading } = useEntity(
    id,
    type === 'companies' ? 'company' : 'account',
  );
  const queryContent = selectedContent ?? (typeof content === 'string' ? content : 'dashboard');

  if ((!entity && !entityLoading) || entityError) {
    return <NoDataError tag={type === 'accounts' ? 'Account' : 'Company'} withButton={true} />;
  }

  return (
    <div data-testid="container" className="max-w-[90%] mx-auto">
      <ReportsContextProvider entity={entity} entityLoading={entityLoading} content={queryContent}>
        <EntityDetail content={queryContent} setContent={setSelectedContent} />
      </ReportsContextProvider>
    </div>
  );
}
