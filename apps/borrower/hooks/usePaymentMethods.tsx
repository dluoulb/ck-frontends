function usePaymentMethods(payment_methods) {
  const activePaymentMethods = payment_methods?.filter(
    (pm) => pm.status !== 'removed'
  );

  const defaultCard = activePaymentMethods?.find(
    (pm) => pm.payment_type === 'card' && pm.is_default
  );
  const defaultBank = activePaymentMethods?.find(
    (pm) => pm.payment_type === 'bank_account' && pm.is_default
  );

  const hasConnectedCards =
    activePaymentMethods?.filter((pm) => pm.payment_type === 'card').length > 0;
  const hasConnectedBanks =
    activePaymentMethods?.filter((pm) => pm.payment_type === 'bank_account')
      .length > 0;

  const defaultBankLabel = hasConnectedBanks
    ? defaultBank?.label || `${defaultBank?.account_holder} Account`
    : null;

  const defaultCardLabel = hasConnectedCards ? defaultCard?.label : null;

  return {
    activePaymentMethods,
    defaultBankLabel,
    defaultCardLabel,
    defaultCard,
    defaultBank,
  };
}

export default usePaymentMethods;
