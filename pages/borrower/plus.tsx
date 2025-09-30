import Error from 'next/error';

import Plus from '@apps/borrower/components/plus';
import { plusEnabled } from '@lib/constants/SiteVariables';

export default function PlusPage() {
  if (!plusEnabled) {
    return <Error statusCode={404} />;
  }

  return plusEnabled ? <Plus /> : null;
}
