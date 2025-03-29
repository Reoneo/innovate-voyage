
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import { BlockchainPassport } from '@/lib/utils';
import { Shield, Info, ListFilter } from 'lucide-react';
import UserCardTooltip from '@/components/jobs/UserCardTooltip';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TalentProfileCardProps {
  passport: BlockchainPassport & {
    score: number;
    category: string;
    colorClass: string;
    hasMoreSkills: boolean;
  };
}

const TalentProfileCard: React.FC<TalentProfileCardProps> = ({ passport }) => {
  const navigate = useNavigate();
  const [showAllSkills, setShowAllSkills] = useState(false);
  
  // Determine which skills to display
  const displayedSkills = showAllSkills 
    ? passport.skills 
    : passport.skills.slice(0, 4);
  
  const viewProfile = () => {
    navigate(`/talent/${passport.passport_id}`);
  };
  
  return (
    <TooltipProvider>
      <Card className="h-full flex flex-col">
        <CardContent className="pt-6 flex-grow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 border">
                <AvatarImage src={passport.avatar_url} alt={passport.passport_id} />
                <AvatarFallback>{passport.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-bold truncate max-w-[180px]">
                  {passport.passport_id}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {passport.owner_address.substring(0, 6)}...{passport.owner_address.substring(passport.owner_address.length - 4)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-secondary">
                    <Shield className={`h-4 w-4 ${passport.colorClass}`} />
                    <span className={`text-xs font-semibold ${passport.colorClass}`}>{passport.score}</span>
                  </div>
                </HoverCardTrigger>
                <UserCardTooltip passport={passport} />
              </HoverCard>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 ml-1.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-sm">Human Score: {passport.score}</p>
                  <p className="text-xs text-muted-foreground">{passport.category}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Additional ENS Domains */}
          {passport.additionalEnsDomains && passport.additionalEnsDomains.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium flex items-center gap-1 mb-1.5">
                <ListFilter className="h-4 w-4" /> 
                Additional ENS Domains
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {passport.additionalEnsDomains.map((domain, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {domain}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h4 className="text-sm font-medium mb-2">Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {displayedSkills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill.name}
                </Badge>
              ))}
              
              {!showAllSkills && passport.hasMoreSkills && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 text-xs px-2 rounded-full"
                  onClick={() => setShowAllSkills(true)}
                >
                  +{passport.skills.length - 4} more
                </Button>
              )}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="pt-0">
          <Button 
            variant="default" 
            className="w-full"
            onClick={viewProfile}
          >
            View Profile
          </Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
};

export default TalentProfileCard;
