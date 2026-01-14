import React from 'react';

import MultiUseVirtualCard from './MultiUseVirtualCard';
import SingleUseVirtualCard from './SingleUseVirtualCard';

export default function VirtualCard({ bannerName }) {
  const multiUseVcEnabled = bannerName === 'multi_use_virtual_card';
  const singleUseVcEnabled = !multiUseVcEnabled && bannerName === 'virtual_card';
  return (
    <>
      {multiUseVcEnabled && <MultiUseVirtualCard />}
      {singleUseVcEnabled && <SingleUseVirtualCard />}
    </>
  );
}
