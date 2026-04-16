import React from 'react';

import MultiUseVirtualCard from './MultiUseVirtualCard';
import SingleUseVirtualCard from './SingleUseVirtualCard';

interface VirtualCardProps {
  bannerName: string;
  onActivateVirtualCard?: () => void;
}

export default function VirtualCard({ bannerName, onActivateVirtualCard }: VirtualCardProps) {
  const multiUseVcEnabled = bannerName === 'multi_use_virtual_card';
  const singleUseVcEnabled = !multiUseVcEnabled && bannerName === 'virtual_card';
  return (
    <>
      {multiUseVcEnabled && <MultiUseVirtualCard onActivateVirtualCard={onActivateVirtualCard} />}
      {singleUseVcEnabled && <SingleUseVirtualCard />}
    </>
  );
}
