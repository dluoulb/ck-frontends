import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';

import { usePromo } from '@contexts/PromoContext';

export default function Promo() {
  const router = useRouter();
  const params = useParams();

  const promo_id = params?.id;
  const { setPromoId } = usePromo();

  useEffect(() => {
    if (promo_id) {
      setPromoId(promo_id);
      router.push('/borrower');
    }
  }, [promo_id, router, setPromoId]);
}
