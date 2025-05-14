
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { WebacyData } from '../../scores/types';

interface ContractApprovalsCardProps {
  webacyData: WebacyData | null;
}

const ContractApprovalsCard: React.FC<ContractApprovalsCardProps> = ({ webacyData }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="font-medium mb-4">Contract Approvals</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-xl font-semibold">
              {webacyData?.approvals?.count || 0}
            </span>
            <span className="text-sm text-muted-foreground">Total Approvals</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-semibold text-amber-600">
              {webacyData?.approvals?.riskyCount || 0}
            </span>
            <span className="text-sm text-muted-foreground">Risky Approvals</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractApprovalsCard;
