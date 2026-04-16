import useCompanyCards from './useCompanyCards';

function useCompanyPhysicalCard() {
  const {
    data: cards,
    error: physicalCardError,
    isLoading: physicalCardLoading,
    isRefetching: physicalCardRefetching,
    refetch: refetchPhysicalCard,
  } = useCompanyCards();

  const physicalCard = cards?.find((card) => card.type === 'PHYSICAL') || null;

  return {
    physicalCard,
    physicalCardError,
    physicalCardLoading,
    physicalCardRefetching,
    refetchPhysicalCard,
  };
}

export default useCompanyPhysicalCard;
