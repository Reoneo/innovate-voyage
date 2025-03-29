
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Twitter, Globe, Mail } from 'lucide-react';
import { truncateAddress } from '@/lib/utils';
import { getScoreColorClass } from '@/lib/utils';

interface ProfileHeaderProps {
  passport: {
    passport_id: string;
    owner_address: string;
    avatar_url: string;
    name: string;
    score: number;
    category: string;
    socials: {
      github?: string;
      twitter?: string;
      linkedin?: string;
      website?: string;
      email?: string;
    };
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ passport }) => {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Avatar className="h-24 w-24">
            <AvatarImage src={passport.avatar_url || '/placeholder.svg'} alt={passport.name} />
            <AvatarFallback>{passport.name?.substring(0, 2)?.toUpperCase() || 'BP'}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">{passport.passport_id}</CardTitle>
                <CardDescription className="text-base">
                  {truncateAddress(passport.owner_address)}
                </CardDescription>
                
                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  {passport.socials?.github && (
                    <a href={passport.socials.github} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Github className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  {passport.socials?.twitter && (
                    <a href={passport.socials.twitter} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Twitter className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  {passport.socials?.linkedin && (
                    <a href={passport.socials.linkedin} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  {passport.socials?.website && (
                    <a href={passport.socials.website} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm">
                        <Globe className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                  {passport.socials?.email && (
                    <a href={`mailto:${passport.socials.email}`}>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </a>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`text-5xl font-bold ${getScoreColorClass(passport.score)}`}>
                      {passport.score}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Human Score</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="text-5xl font-bold text-green-500">
                      85
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">TP Score</div>
                  </div>
                </div>
                
                <div className="mt-2">
                  <Badge className="text-xs">{passport.category}</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ProfileHeader;
