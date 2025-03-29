
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Coins } from 'lucide-react';
import { BlockchainProfile } from '@/api/types/etherscanTypes';
import SkillsNodeLeafD3 from '@/components/visualizations/skills/SkillsNodeLeafD3';
import TransactionHistoryChart from '@/components/visualizations/transactions/TransactionHistoryChart';

interface OverviewTabProps {
  skills: Array<{ name: string; proof?: string; issued_by?: string }>;
  name: string;
  blockchainProfile?: BlockchainProfile | null;
  transactions?: any[] | null;
  address: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  skills, 
  name, 
  blockchainProfile, 
  transactions, 
  address 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Skills Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Award className="h-5 w-5" /> Skills & Expertise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <Badge 
                key={`${skill.name}-${idx}`} 
                variant={skill.proof ? "default" : "secondary"}
              >
                {skill.name}
              </Badge>
            ))}
          </div>
          
          <div className="mt-4 h-60">
            <SkillsNodeLeafD3 
              skills={skills} 
              name={name} 
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Blockchain Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Coins className="h-5 w-5" /> Blockchain Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="text-sm text-muted-foreground">ETH Balance</div>
              <div className="font-medium">{blockchainProfile?.balance || "0"} ETH</div>
            </div>
            <div className="flex justify-between">
              <div className="text-sm text-muted-foreground">Transactions</div>
              <div className="font-medium">{blockchainProfile?.transactionCount || "0"}</div>
            </div>
            
            {transactions && transactions.length > 0 && (
              <div className="h-48 mt-6">
                <TransactionHistoryChart transactions={transactions} address={address} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
