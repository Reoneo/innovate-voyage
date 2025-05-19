
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

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
        
        // Use CORS proxy to avoid cross-origin issues
        // The Warpcast API endpoint for user casts
        const apiUrl = `https://api.warpcast.com/v2/user-casts?username=${encodeURIComponent(handle)}`;
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;
        
        const response = await fetch(proxyUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch casts: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Parse the contents from the proxy response
        if (data && data.contents) {
          try {
            const parsedData = JSON.parse(data.contents);
            console.log('Farcaster API response:', parsedData);
            
            if (parsedData.result && parsedData.result.casts) {
              setCasts(parsedData.result.casts);
            } else if (parsedData.errors) {
              // Handle API errors
              const errorMessage = parsedData.errors[0]?.message || 'Unknown API error';
              console.error('Farcaster API error:', errorMessage);
              setError(errorMessage);
              toast.error('Farcaster API Error', {
                description: errorMessage
              });
            } else {
              setError('No casts found');
            }
          } catch (parseError) {
            console.error('Error parsing Farcaster data:', parseError);
            setError('Unable to parse casts data');
          }
        } else {
          setError('No data received from Farcaster API');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Farcaster casts:', err);
        setError('Unable to load casts');
        toast.error('Failed to load Farcaster casts', {
          description: 'There was an issue connecting to the Farcaster API'
        });
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
          <div className="text-red-500 p-4 text-center">{error}</div>
        )}

        {!loading && !error && casts.length === 0 && (
          <div className="text-gray-500 p-4 text-center">No casts found for @{handle}</div>
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
                  <span>{formatTimestamp(cast.timestamp)}</span>
                  <div className="flex gap-3">
                    {cast.reactions && (
                      <span title="Likes">❤️ {cast.reactions.count}</span>
                    )}
                    {cast.replies && (
                      <span title="Replies">💬 {cast.replies.count}</span>
                    )}
                    {cast.recasts && (
                      <span title="Recasts">🔄 {cast.recasts.count}</span>
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
