
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Repeat2, ExternalLink, Users, UserCheck } from 'lucide-react';
import { SignInButton, useProfile } from '@farcaster/auth-kit';
import { useFarcasterCasts } from '@/hooks/useFarcasterCasts';
import { Skeleton } from '@/components/ui/skeleton';

interface FarcasterCastsSectionProps {
  ensName?: string;
  address?: string;
}

const FarcasterCastsSection: React.FC<FarcasterCastsSectionProps> = ({
  ensName,
  address
}) => {
  const {
    loading,
    profile,
    casts,
    error,
    hasFarcasterData,
    isAuthenticatedUser
  } = useFarcasterCasts(ensName, address);
  
  const { isAuthenticated } = useProfile();

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-32" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-16 w-full" />
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !hasFarcasterData) {
    // Show connection option if no data found and this could be the user's own profile
    if (!hasFarcasterData && !isAuthenticated) {
      return (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-purple-600 flex items-center justify-center">
                <span className="text-white text-xs font-bold">F</span>
              </div>
              Farcaster Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">No Farcaster Activity Found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find a Farcaster profile for {ensName || address}
              </p>
              <SignInButton>
                <Button variant="outline">
                  Connect with Farcaster
                </Button>
              </SignInButton>
            </div>
          </CardContent>
        </Card>
      );
    }
    return null; // Don't show the section if there's no Farcaster data and user is authenticated
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">F</span>
          </div>
          Farcaster Activity
          {profile && (
            <Badge variant="secondary" className="ml-auto">
              @{profile.username}
            </Badge>
          )}
          {isAuthenticatedUser && (
            <Badge variant="default" className="ml-2 flex items-center gap-1">
              <UserCheck className="h-3 w-3" />
              Verified
            </Badge>
          )}
        </CardTitle>
        {profile && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {profile.followerCount} followers
            </span>
            <span>{profile.followingCount} following</span>
            {profile.verifications?.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {profile.verifications.length} verified
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {casts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No recent casts found</p>
              {profile && (
                <a 
                  href={`https://warpcast.com/${profile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-sm text-blue-600 hover:text-blue-800"
                >
                  View profile on Warpcast
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          ) : (
            casts.slice(0, 5).map((cast) => (
              <div key={cast.hash} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={cast.author.pfp?.url} alt={cast.author.displayName} />
                    <AvatarFallback>
                      {cast.author.displayName?.slice(0, 2).toUpperCase() || 'FC'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">{cast.author.displayName}</span>
                      <span className="text-muted-foreground text-sm">@{cast.author.username}</span>
                      <span className="text-muted-foreground text-sm">·</span>
                      <span className="text-muted-foreground text-sm">{formatTimestamp(cast.timestamp)}</span>
                    </div>
                    
                    <p className="text-sm mb-3 whitespace-pre-wrap break-words">{cast.text}</p>
                    
                    {cast.embeds && cast.embeds.length > 0 && (
                      <div className="mb-3">
                        {cast.embeds.map((embed, index) => 
                          embed.url && (
                            <a 
                              key={index}
                              href={embed.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 mb-1"
                            >
                              <ExternalLink className="h-4 w-4" />
                              {embed.url.length > 50 ? `${embed.url.slice(0, 50)}...` : embed.url}
                            </a>
                          )
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-6 text-muted-foreground">
                      <div className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        <span className="text-sm">{cast.replies?.count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 hover:text-green-600 transition-colors">
                        <Repeat2 className="h-4 w-4" />
                        <span className="text-sm">{cast.reactions?.recasts?.count || 0}</span>
                      </div>
                      <div className="flex items-center gap-1 hover:text-red-600 transition-colors">
                        <Heart className="h-4 w-4" />
                        <span className="text-sm">{cast.reactions?.likes?.count || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {profile && casts.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <a 
              href={`https://warpcast.com/${profile.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View all casts on Warpcast
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FarcasterCastsSection;
