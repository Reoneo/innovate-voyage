
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Dices, BadgeCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TalentScoreBadgeProps } from './types';

const TalentScoreBadge: React.FC<TalentScoreBadgeProps> = ({ 
  score,
  isLoading
}) => {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm bg-white">
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <BadgeCheck className="h-4 w-4 text-primary" />
            <span>Talent Score</span>
          </div>
          
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">
                {score !== null && score !== undefined ? score : 'N/A'}
              </span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">Based on skills & contributions</p>
        </div>
        
        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Dices className="h-6 w-6 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
};

export default TalentScoreBadge;
