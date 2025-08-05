import { useBorrowerDeps } from '@contexts/BorrowerContext';

export default function OrdersBadge() {
  const { stats } = useBorrowerDeps();

  const count = stats?.active ?? 0;
  if (count <= 0) return null;

  return (
    <span className="ml-1 px-2 py-0.5 text-xs font-semibold text-black border border-gray-300 rounded-full bg-white">
      {count > 99 ? '+99' : count}
    </span>
  );
}