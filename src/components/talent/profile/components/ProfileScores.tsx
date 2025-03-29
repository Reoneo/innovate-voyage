
import React from 'react';
import { Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getScoreColorClass } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProfileScoresProps {
  humanScore: number;
  category: string;
}

const ProfileScores: React.FC<ProfileScoresProps> = ({ humanScore, category }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex flex-col items-center">
              <div className={`text-5xl font-bold ${getScoreColorClass(humanScore)}`}>
                {humanScore}
              </div>
              <div className="text-sm text-muted-foreground mt-1 flex items-center">
                Human Score
                <Info className="h-3 w-3 ml-1 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="p-3 max-w-[250px]">
              <p className="font-semibold mb-1">Human Score Explained</p>
              <p className="text-sm">This score represents the validity and trustworthiness of the blockchain identity, based on on-chain activity, transactions, and interactions.</p>
              <div className="mt-2 text-xs font-medium">
                <div className="flex justify-between">
                  <span>0-30</span>
                  <span className="text-gray-500">New/Limited Activity</span>
                </div>
                <div className="flex justify-between">
                  <span>30-60</span>
                  <span className="text-blue-500">Established</span>
                </div>
                <div className="flex justify-between">
                  <span>60-90</span>
                  <span className="text-purple-500">Trusted</span>
                </div>
                <div className="flex justify-between">
                  <span>90-100</span>
                  <span className="text-indigo-500">Elite</span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="flex flex-col items-center">
              <div className="text-5xl font-bold text-green-500">
                85
              </div>
              <div className="text-sm text-muted-foreground mt-1 flex items-center">
                TP Score
                <Info className="h-3 w-3 ml-1 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="p-3 max-w-[250px]">
              <p className="font-semibold mb-1">TalentProtocol Score Explained</p>
              <p className="text-sm">This score represents the professional evaluation based on verified skills, contributions, and activity on TalentProtocol platform.</p>
              <div className="mt-2 text-xs font-medium">
                <div className="flex justify-between">
                  <span>0-40</span>
                  <span className="text-gray-500">Beginner</span>
                </div>
                <div className="flex justify-between">
                  <span>41-70</span>
                  <span className="text-blue-500">Intermediate</span>
                </div>
                <div className="flex justify-between">
                  <span>71-90</span>
                  <span className="text-green-500">Advanced</span>
                </div>
                <div className="flex justify-between">
                  <span>91-100</span>
                  <span className="text-emerald-500">Expert</span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="mt-2">
        <Badge className="text-xs">{category}</Badge>
      </div>
    </div>
  );
};

export default ProfileScores;
