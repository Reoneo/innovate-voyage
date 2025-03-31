
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, ListChecks } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import IdNetworkGraph from '@/components/visualizations/identity/IdNetworkGraph';

interface SkillsTabProps {
  skills: Array<{ name: string; proof?: string; issued_by?: string }>;
  name: string;
  avatarUrl?: string;
  ensName?: string;
  ownerAddress?: string;
}

const SkillsTab: React.FC<SkillsTabProps> = ({ skills, name, avatarUrl, ensName, ownerAddress }) => {
  const verifiedSkills = skills.filter(skill => skill.proof);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="overflow-hidden" id="skills-section">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-primary" />
                Skills List
              </CardTitle>
              <CardDescription className="mt-1">
                Your verified skills
              </CardDescription>
            </div>
            <div className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
              {skills.length} skills
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Verified Skills</h4>
              <div className="flex flex-wrap gap-2">
                {verifiedSkills.length > 0 ? (
                  verifiedSkills.map((skill, index) => (
                    <Badge key={`verified-${index}`} variant="default" className="bg-green-500 hover:bg-green-600">
                      {skill.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No verified skills yet</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-4 border-t pt-3">
            <h4 className="text-sm font-medium mb-2">Legend:</h4>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div>
                <span>Verified Skill</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-8">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-primary" />
                  ID Network
                </CardTitle>
                <CardDescription className="mt-1">
                  ENS Domain & Identity connection
                </CardDescription>
              </div>
              <div className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                Interactive
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full pt-4">
              <IdNetworkGraph 
                name={name} 
                avatarUrl={avatarUrl}
                ensName={ensName}
                address={ownerAddress}
              />
            </div>
            <div className="mt-4 border-t pt-3">
              <h4 className="text-sm font-medium mb-2">Legend:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></div>
                  <span>Main Identity</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-violet-500 mr-1.5"></div>
                  <span>ENS Domain</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkillsTab;
