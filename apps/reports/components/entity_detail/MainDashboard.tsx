import React from 'react';

import { BaseGrid, BaseGridItem } from '@apps/reports/components/BaseGrid';
import { Applications } from './widgets/Applications';
import Attachments from './widgets/Attachments/Attachments';
import EntityInfo from './widgets/EntityInfo';
import OwnerInfo from './widgets/OwnerInfo';

export default function MainDashboard({ props }) {
  return (
    <div className="p-2.5" role={MainDashboard.role}>
      <BaseGrid>
        <BaseGridItem gridConfig="md:col-span-2 md:row-span-2">
          <EntityInfo props={props} />
        </BaseGridItem>

        <BaseGridItem gridConfig="md:col-span-2 md:row-span-2 lg:row-start-3">
          <OwnerInfo props={props} />
        </BaseGridItem>

        <BaseGridItem gridConfig="md:col-span-4 lg:col-span-3 md:row-span-4">
          <Applications props={props} />
        </BaseGridItem>

        <BaseGridItem gridConfig="md:col-span-5 md:row-span-1 lg:row-start-5">
          <Attachments props={props} />
        </BaseGridItem>
      </BaseGrid>
    </div>
  );
}

MainDashboard.role = 'main-dashboard-component';
