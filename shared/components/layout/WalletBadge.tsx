import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import useCompanyPhysicalCard from '@apps/borrower/hooks/useCompanyPhysicalCard';

export default function WalletBadge() {
  const { virtualCard } = useCompanyVirtualCard();
  const { physicalCard } = useCompanyPhysicalCard();
 
  let count = 0;

  if (virtualCard) count++;
  if (physicalCard && physicalCard.status === 'ACTIVE') count++;
  
  if (count <= 0) return null;

  return (
    <span className="ml-1 px-2 py-0.5 text-xs font-semibold text-black border border-gray-300 rounded-full bg-white">
      {count}
    </span>
  );
}