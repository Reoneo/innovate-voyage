
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, ExternalLink } from 'lucide-react';
import { BlockchainProfile } from '@/api/types/etherscanTypes';
import SkillsNodeLeafD3 from '@/components/visualizations/skills/SkillsNodeLeafD3';
import { Button } from '@/components/ui/button';

interface OverviewTabProps {
  skills: Array<{ name: string; proof?: string; issued_by?: string }>;
  name: string;
  blockchainProfile?: BlockchainProfile | null;
  transactions?: any[] | null;
  address: string;
  blockchainExtendedData?: {
    mirrorPosts: number;
    lensActivity: number;
    boxDomains: string[];
    snsActive: boolean;
  };
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  skills, 
  name, 
  blockchainProfile, 
  transactions, 
  address,
  blockchainExtendedData
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
      
      {/* Web3 Social Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ExternalLink className="h-5 w-5" /> Web3 Social Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Mirror.xyz Activity */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <h3 className="font-medium">Mirror.xyz</h3>
                <p className="text-sm text-muted-foreground">
                  {blockchainExtendedData?.mirrorPosts || 0} posts published
                </p>
              </div>
              <a href={`https://mirror.xyz/${address}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" /> View
                </Button>
              </a>
            </div>
            
            {/* Lens Protocol Activity */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <h3 className="font-medium">Lens Protocol</h3>
                <p className="text-sm text-muted-foreground">
                  {blockchainExtendedData?.lensActivity || 0} activities
                </p>
              </div>
              <a href={`https://hey.xyz/u/${address}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" /> View
                </Button>
              </a>
            </div>
            
            {/* Farcaster Activity */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <h3 className="font-medium">Farcaster</h3>
                <p className="text-sm text-muted-foreground">
                  Active user
                </p>
              </div>
              <a href={`https://warpcast.com/${address}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-1" /> View
                </Button>
              </a>
            </div>

            {blockchainExtendedData?.snsActive && (
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <h3 className="font-medium">SNS.ID</h3>
                  <p className="text-sm text-muted-foreground">Active user</p>
                </div>
                <a href={`https://sns.id/${address}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-1" /> View
                  </Button>
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
