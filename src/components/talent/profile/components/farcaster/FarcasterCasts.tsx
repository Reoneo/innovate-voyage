
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Clock, MessageSquare, Repeat, Heart } from 'lucide-react';

interface CastAuthor {
  fid: number;
  username: string;
  displayName?: string;
  pfp?: {
    url: string;
  };
}

interface FarcasterReaction {
  count: number;
}

interface FarcasterReplies {
  count: number;
}

interface FarcasterRecasts {
  count: number;
}

interface Cast {
  hash: string;
  threadHash?: string;
  parentHash?: string;
  author: CastAuthor;
  text: string;
  timestamp: string;
  reactions: FarcasterReaction;
  replies: FarcasterReplies;
  recasts: FarcasterRecasts;
  embeds?: any[];
  mentions?: any[];
}

interface FarcasterCastsProps {
  handle?: string;
}

const FarcasterCasts: React.FC<FarcasterCastsProps> = ({ handle }) => {
  const [casts, setCasts] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!handle) {
      setLoading(false);
      return;
    }

    const fetchCasts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log(`Fetching casts for Farcaster user: ${handle}`);
        
        // Multiple API endpoints to try
        const endpoints = [
          `https://api.warpcast.com/v2/user-casts?username=${encodeURIComponent(handle)}`,
          `https://api.neynar.com/v2/farcaster/casts?username=${encodeURIComponent(handle)}&limit=20`,
          `https://api.farcaster.xyz/v2/casts?username=${encodeURIComponent(handle)}`
        ];
        
        // Try each endpoint with a CORS proxy
        let success = false;
        
        for (const endpoint of endpoints) {
          if (success) break;
          
          try {
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(endpoint)}`;
            const response = await fetch(proxyUrl);
            
            if (!response.ok) continue;
            
            const data = await response.json();
            
            // Parse the contents from the proxy response
            if (data && data.contents) {
              const parsedData = JSON.parse(data.contents);
              console.log('Farcaster API response:', parsedData);
              
              if (parsedData.result && parsedData.result.casts && parsedData.result.casts.length > 0) {
                setCasts(parsedData.result.casts);
                success = true;
                break;
              } else if (parsedData.casts && parsedData.casts.length > 0) {
                setCasts(parsedData.casts);
                success = true;
                break;
              } else if (parsedData.data && parsedData.data.length > 0) {
                setCasts(parsedData.data);
                success = true;
                break;
              } else if (parsedData.errors) {
                console.error('Farcaster API error:', parsedData.errors);
              }
            }
          } catch (endpointError) {
            console.error(`Error with endpoint ${endpoint}:`, endpointError);
            // Continue to try next endpoint
          }
        }
        
        if (!success) {
          setError('Unable to fetch Farcaster data from any available API');
          toast.error('Failed to load Farcaster casts', {
            description: 'Could not connect to Farcaster API'
          });
        }
      } catch (err) {
        console.error('Error fetching Farcaster casts:', err);
        setError('Unable to load casts');
        toast.error('Failed to load Farcaster casts', {
          description: 'There was an issue connecting to the Farcaster API'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCasts();
  }, [handle]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!handle) return null;

  return (
    <div className="farcaster-section w-full overflow-hidden">
      <div className="farcaster-header rounded-md p-2 mb-3 flex items-center justify-between bg-slate-400">
        <div className="text-sm font-semibold text-white">
          <span className="text-base font-bold">Farcaster Activity: </span>
          <span className="text-base font-bold">@{handle}</span>
        </div>
      </div>

      <div className="farcaster-content bg-slate-400 rounded-lg p-2 mb-4">
        {loading && (
          <>
            <Skeleton className="h-16 w-full mb-2" />
            <Skeleton className="h-16 w-full mb-2" />
            <Skeleton className="h-16 w-full" />
          </>
        )}

        {error && (
          <div className="text-red-500 p-4 text-center bg-slate-300 rounded-md">
            {error}
            <div className="mt-2 text-sm">
              Note: Not all Farcaster users have public data available through the API
            </div>
          </div>
        )}

        {!loading && !error && casts.length === 0 && (
          <div className="text-gray-500 p-4 text-center bg-slate-300 rounded-md">
            No casts found for @{handle}
            <div className="mt-2 text-sm">
              This user may not have public casts or may not be using Farcaster
            </div>
          </div>
        )}

        {!loading && !error && casts.length > 0 && (
          <div className="space-y-3">
            {casts.map((cast) => (
              <div key={cast.hash} className="cast bg-slate-300 rounded-md p-3">
                <div className="flex items-center gap-2 mb-2">
                  {cast.author.pfp?.url && (
                    <img 
                      src={cast.author.pfp.url} 
                      alt={cast.author.displayName || cast.author.username} 
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="font-medium">
                    {cast.author.displayName || cast.author.username}
                  </span>
                  <span className="text-xs text-gray-600">
                    @{cast.author.username}
                  </span>
                </div>
                
                <p className="text-sm mb-2">{cast.text}</p>
                
                <div className="flex justify-between items-center text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimestamp(cast.timestamp)}</span>
                  </div>
                  <div className="flex gap-3">
                    {cast.reactions && (
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{cast.reactions.count}</span>
                      </div>
                    )}
                    {cast.replies && (
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{cast.replies.count}</span>
                      </div>
                    )}
                    {cast.recasts && (
                      <div className="flex items-center gap-1">
                        <Repeat className="h-3 w-3" />
                        <span>{cast.recasts.count}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {cast.parentHash && (
                  <div className="text-xs text-blue-600 mt-1">
                    ↩️ Reply to a cast
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarcasterCasts;
