
import React from 'react';
import { useTalentProtocolData } from './hooks/useTalentProtocolData';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Globe } from 'lucide-react';

interface TalentProtocolDetailsProps {
  walletAddress: string;
}

const TalentProtocolDetails: React.FC<TalentProtocolDetailsProps> = ({ walletAddress }) => {
    const { data, isLoading } = useTalentProtocolData(walletAddress);

    if (isLoading) {
        return (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        );
    }

    if (!data?.profile) {
        return (
          <Card>
            <CardHeader>
              <CardTitle>Talent Protocol Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No detailed Talent Protocol profile found for this address.</p>
            </CardContent>
          </Card>
        );
    }

    const { profile } = data;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={profile.profile_picture_url} alt={profile.name} />
                    <AvatarFallback>{profile.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    {profile.name}
                    <CardDescription>@{profile.username}</CardDescription>
                  </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {profile.headline && <p className="text-sm text-muted-foreground">{profile.headline}</p>}
                {profile.bio && <p className="text-sm">{profile.bio}</p>}
                
                {profile.social_links && profile.social_links.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Social Links</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.social_links.map((link, index) => (
                        <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline flex items-center gap-1">
                          <Globe size={14} />
                          <span>{new URL(link.url).hostname.replace('www.','')}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
            </CardContent>
        </Card>
    );
}

export default TalentProtocolDetails;
