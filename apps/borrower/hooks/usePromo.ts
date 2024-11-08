import { useQueryClient } from '@tanstack/react-query';

export default function usePromo() {
  const queryClient = useQueryClient();
  const defaultMerchant = queryClient.getQueryData([
    'merchant',
    process.env.NEXT_PUBLIC_VIRTUAL_CARD_MERCHANT_ID,
  ]);

  const getPromoFromMerchant = (
    id: string,
    merchant: any = defaultMerchant || {}
  ) => {
    if (!merchant) merchant = defaultMerchant;
    return (merchant?.promos || []).find((p) => p.id === id);
  };

  return { getPromoFromMerchant };
}
