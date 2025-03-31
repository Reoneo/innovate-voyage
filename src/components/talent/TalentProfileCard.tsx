
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import { BlockchainPassport } from '@/lib/utils';
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
  const navigate = useNavigate();
  
  const viewProfile = () => {
    // Use direct profile path for cleaner URLs
    navigate(`/${passport.passport_id}`);
  };
  
  return (
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
                <div></div>
              </HoverCardTrigger>
              <UserCardTooltip passport={passport} />
            </HoverCard>
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
  );
};

export default TalentProfileCard;
