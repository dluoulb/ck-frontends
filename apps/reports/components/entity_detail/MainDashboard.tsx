import React from 'react';

import { BaseGrid, BaseGridItem } from '@components/BaseGrid';
import Loading from '@components/Loading';
import { useReportsDeps } from '@contexts/ReportsContext';
import { Applications } from './widgets/Applications';
import Attachments from './widgets/Attachments/Attachments';
import EntityInfo from './widgets/EntityInfo';
import OwnerInfo from './widgets/OwnerInfo';

export default function MainDashboard() {
  const { isLoading } = useReportsDeps();
  if (isLoading) return <Loading className="w-14 h-14 my-20" containerClass="min-h-[72rem]" />;

  return (
    <div className="p-2.5" role={MainDashboard.role}>
      <BaseGrid gridContainerClass="gap-x-1.5 md:gap-x-3">
        <BaseGridItem gridConfig="md:col-span-2 md:row-span-2">
          <EntityInfo />
        </BaseGridItem>

        <BaseGridItem gridConfig="md:col-span-2 md:row-span-2 lg:row-start-3">
          <OwnerInfo />
        </BaseGridItem>

        <BaseGridItem gridConfig="md:col-span-4 lg:col-span-3 md:row-span-4">
          <Applications />
        </BaseGridItem>

        <BaseGridItem gridConfig="md:col-span-5 md:row-span-1 lg:row-start-5">
          <Attachments />
        </BaseGridItem>
      </BaseGrid>
    </div>
  );
}

MainDashboard.role = 'main-dashboard-component';
