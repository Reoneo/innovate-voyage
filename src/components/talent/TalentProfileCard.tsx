
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import { Shield, Award, Info, Star } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { truncateAddress, BlockchainPassport } from '@/lib/utils';
import UserCardTooltip from '@/components/jobs/UserCardTooltip';

interface TalentProfileCardProps {
  passport: BlockchainPassport & {
    score: number;
    category: string;
    colorClass: string;
    hasMoreSkills: boolean;
  };
}

const TalentProfileCard: React.FC<TalentProfileCardProps> = ({ passport }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={passport.avatar_url} alt={passport.passport_id} />
          <AvatarFallback>{passport.passport_id.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <CardTitle>{passport.passport_id}</CardTitle>
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <Shield className={`h-4 w-4 ${passport.colorClass}`} />
                  <span className={`font-bold ${passport.colorClass}`}>{passport.score}</span>
                </div>
              </HoverCardTrigger>
              <UserCardTooltip passport={passport} />
            </HoverCard>
          </div>
          <CardDescription className="truncate">{truncateAddress(passport.owner_address)}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
            <Award className="h-4 w-4" /> Skills
          </h4>
          <div className="flex flex-wrap gap-1 mt-1">
            {passport.skills?.slice(0, 4).map((skill, idx) => (
              <Badge 
                key={`${skill.name}-${idx}`} 
                variant={skill.proof ? "default" : "secondary"} 
                className="text-xs"
              >
                {skill.proof && <Star className="h-3 w-3 mr-1" />}
                {skill.name}
              </Badge>
            ))}
            {passport.hasMoreSkills && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs cursor-help">
                      <Info className="h-3 w-3 mr-1" />
                      +{passport.skills.length - 4} more
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="w-64 p-2">
                    <p className="font-medium mb-1">Additional Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {passport.skills?.slice(4).map((skill, idx) => (
                        <Badge 
                          key={`more-${skill.name}-${idx}`} 
                          variant={skill.proof ? "default" : "secondary"} 
                          className="text-xs"
                        >
                          {skill.proof && <Star className="h-3 w-3 mr-1" />}
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Human Score:</span> {passport.category}
        </div>
      </CardContent>
    </Card>
  );
};

export default TalentProfileCard;
