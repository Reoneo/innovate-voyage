
import React from 'react';
import { useTalentProtocolData } from './hooks/useTalentProtocolData';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Globe, Building, Award, ExternalLink, Users, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={profile.profile_picture_url} alt={profile.name} />
                        <AvatarFallback>{profile.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-bold">{profile.name}</h2>
                          {profile.verified && <img src="https://ipfscdn.io/ipfs/bafybeie27s2chl53e4wipfbbj5dy5kfg2wsxw6s64og4b4zvwa6f4s2v54/verified_badge.svg" alt="Verified" className="h-6 w-6" />}
                        </div>
                        <CardDescription>@{profile.username}</CardDescription>
                      </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {profile.headline && <p className="text-lg text-muted-foreground">{profile.headline}</p>}
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

            {profile.tags && profile.tags.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Tags</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {profile.tags.map(tag => (
                            <Badge key={tag.name} variant="secondary">{tag.name}</Badge>
                        ))}
                    </CardContent>
                </Card>
            )}

            {(profile.supporter_count || profile.subscriber_count) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Users size={20} /> Community</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">{profile.subscriber_count ?? 0}</span>
                    <span className="text-sm text-muted-foreground">Followers</span>
                  </div>
                   <div className="flex flex-col">
                    <span className="text-2xl font-bold">{profile.subscribing_count ?? 0}</span>
                    <span className="text-sm text-muted-foreground">Following</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold">{profile.supporter_count ?? 0}</span>
                    <span className="text-sm text-muted-foreground">Supporters</span>
                  </div>
                   <div className="flex flex-col">
                    <span className="text-2xl font-bold">{profile.supporting_count ?? 0}</span>
                    <span className="text-sm text-muted-foreground">Supporting</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {profile.career_experience && profile.career_experience.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Building size={20} /> Career Experience</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {profile.career_experience.map((exp, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="mt-1 h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Building size={20} className="text-gray-500" />
                                </div>
                                <div>
                                    <h4 className="font-semibold">{exp.title}</h4>
                                    <p className="text-sm">{exp.company}</p>
                                    <p className="text-xs text-muted-foreground">{exp.start_date} - {exp.end_date ?? 'Present'}</p>
                                    {exp.description && <p className="text-sm mt-2 text-muted-foreground">{exp.description}</p>}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {profile.milestones && profile.milestones.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Award size={20} /> Milestones</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {profile.milestones.map((milestone, index) => (
                            <div key={index}>
                                <h4 className="font-semibold">{milestone.title}</h4>
                                <p className="text-xs text-muted-foreground">{milestone.date}</p>
                                {milestone.description && <p className="text-sm mt-1 text-muted-foreground">{milestone.description}</p>}
                                {milestone.link && <a href={milestone.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline flex items-center gap-1 mt-1">
                                  <ExternalLink size={14} /> View More
                                </a>}
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
            
            {profile.token_address && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Package size={20} /> Talent Token</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Supply</p>
                      <p className="text-xl font-bold">{profile.total_supply}</p>
                    </div>
                    <a href={`https://etherscan.io/token/${profile.token_address}`} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline flex items-center gap-1">
                      View on Etherscan <ExternalLink size={14} />
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
    );
}

export default TalentProtocolDetails;
