import React, { createContext, useContext, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

const PromoContext = createContext(null);

export const PromoContextProvider = ({ children }) => {
  const [promoId, setPromoId] = useState('');
  const queryClient = useQueryClient();
  const defaultMerchant = queryClient.getQueryData([
    'merchant',
    process.env.NEXT_PUBLIC_VIRTUAL_CARD_MERCHANT_ID,
  ]);

  const getPromoFromMerchant = (id: string, merchant: any = defaultMerchant || {}) => {
    if (!merchant) merchant = defaultMerchant;
    return (merchant?.promos || []).find((p) => p.id === id);
  };

  return (
    <PromoContext.Provider
      value={{
        promoId,
        setPromoId,
        getPromoFromMerchant,
      }}
    >
      {children}
    </PromoContext.Provider>
  );
};

export const usePromo = () => {
  const context = useContext(PromoContext);
  if (!context) {
    throw new Error('usePromo must be used within a PromoContextProvider');
  }

  return context;
};
