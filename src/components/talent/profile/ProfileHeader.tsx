
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Twitter, Globe, Mail, Info, Copy } from 'lucide-react';
import { truncateAddress } from '@/lib/utils';
import { getScoreColorClass } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from '@/hooks/use-toast';

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
    bio?: string; // Add bio field
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ passport }) => {
  const isMobile = useIsMobile();

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(passport.owner_address);
    toast({
      title: "Address copied",
      description: "Wallet address copied to clipboard"
    });
  };

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
                <CardDescription className="text-base flex items-center gap-1">
                  {truncateAddress(passport.owner_address)}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0" 
                    onClick={copyAddressToClipboard}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </CardDescription>
                
                {/* Add ENS bio if available */}
                {passport.bio && (
                  <p className="text-sm mt-1.5 text-muted-foreground">
                    {passport.bio}
                  </p>
                )}
                
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
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="flex flex-col items-center">
                        <div className={`text-5xl font-bold ${getScoreColorClass(passport.score)}`}>
                          {passport.score}
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
