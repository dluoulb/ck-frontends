import useCompanyCards from './useCompanyCards';

function useCompanyVirtualCard() {
  const {
    data: cards,
    error: virtualCardError,
    isLoading: virtualCardLoading,
    isRefetching: virtualCardRefetching,
    refetch: refetchVirtualCard,
  } = useCompanyCards();

  const virtualCard = cards?.find((card) => card.type === 'VIRTUAL' && card.is_default) || null;

  return {
    virtualCard,
    virtualCardError,
    virtualCardLoading,
    virtualCardRefetching,
    refetchVirtualCard,
  };
}
export default useCompanyVirtualCard;
