
import React from 'react';
import { useFarcasterCasts } from '@/hooks/useFarcasterCasts';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Repeat2, Heart, ExternalLink } from 'lucide-react';

interface FarcasterCastsSectionProps {
  ensName?: string;
  address?: string;
}

const FarcasterCastsSection: React.FC<FarcasterCastsSectionProps> = ({
  ensName,
  address
}) => {
  const { loading, profile, casts, error, hasFarcasterData } = useFarcasterCasts(ensName, address);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <img 
              src="https://developers.moralis.com/wp-content/uploads/web3wiki/166-farcaster/637aede94d31498505bc9412_DpYIEpePqjDcHIbux04cOKhrRwBhi7F0-dBF_JCdCYY.png" 
              alt="Farcaster" 
              className="w-5 h-5"
            />
            Farcaster Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Loading Farcaster activity...</div>
        </CardContent>
      </Card>
    );
  }

  if (error || !hasFarcasterData) {
    return null; // Hide section if no Farcaster data
  }

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts * 1000);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <img 
            src="https://developers.moralis.com/wp-content/uploads/web3wiki/166-farcaster/637aede94d31498505bc9412_DpYIEpePqjDcHIbux04cOKhrRwBhi7F0-dBF_JCdCYY.png" 
            alt="Farcaster" 
            className="w-5 h-5"
          />
          Farcaster Activity
        </CardTitle>
        {profile && (
          <div className="flex items-center gap-3 pt-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile.pfp} alt={profile.username} />
              <AvatarFallback>{profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{profile.displayName}</p>
              <p className="text-xs text-muted-foreground">@{profile.username}</p>
            </div>
            <div className="flex gap-3 ml-auto text-xs text-muted-foreground">
              {profile.followerCount !== undefined && (
                <span>{profile.followerCount} followers</span>
              )}
              {profile.followingCount !== undefined && (
                <span>{profile.followingCount} following</span>
              )}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {casts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent casts found.</p>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {casts.map((cast) => (
              <div key={cast.hash} className="border-b border-border pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm leading-relaxed">{cast.text || '(No text content)'}</p>
                  <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                    {formatTimestamp(cast.ts)}
                  </span>
                </div>
                
                {cast.embed?.url && (
                  <div className="mt-2">
                    <a 
                      href={cast.embed.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View attachment
                    </a>
                  </div>
                )}
                
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  {cast.replies !== undefined && (
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>{cast.replies}</span>
                    </div>
                  )}
                  {cast.recasts !== undefined && (
                    <div className="flex items-center gap-1">
                      <Repeat2 className="h-3 w-3" />
                      <span>{cast.recasts}</span>
                    </div>
                  )}
                  {cast.reactions !== undefined && (
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      <span>{cast.reactions}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FarcasterCastsSection;
