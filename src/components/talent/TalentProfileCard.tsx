
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import { BlockchainPassport } from '@/lib/utils';
import UserCardTooltip from '@/components/jobs/UserCardTooltip';
import { SocialIcon } from '@/components/ui/social-icon';
import { socialPlatforms } from '@/constants/socialPlatforms';

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
  
  // Get available social platforms from the passport
  const availableSocials = passport.socials ? 
    socialPlatforms.filter(platform => 
      passport.socials && passport.socials[platform.key]
    ).slice(0, 4) : [];
  
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
        
        {/* Display social links if available */}
        {availableSocials.length > 0 && (
          <div className="flex space-x-2 mt-2">
            {availableSocials.map((platform) => (
              passport.socials && passport.socials[platform.key] ? (
                <a 
                  key={platform.key}
                  href={platform.key === 'whatsapp' 
                    ? `https://wa.me/${passport.socials[platform.key]}` 
                    : passport.socials[platform.key]
                  } 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity bg-secondary/30 p-1.5 rounded-full"
                  aria-label={`Visit ${platform.key}`}
                >
                  <SocialIcon 
                    type={platform.type as any} 
                    size={16}
                  />
                </a>
              ) : null
            ))}
            
            {passport.socials?.email && (
              <a 
                href={`mailto:${passport.socials.email}`}
                className="hover:opacity-80 transition-opacity bg-secondary/30 p-1.5 rounded-full"
                aria-label="Send email"
              >
                <SocialIcon type="mail" size={16} />
              </a>
            )}
          </div>
        )}
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
