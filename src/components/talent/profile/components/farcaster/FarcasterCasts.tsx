
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface Cast {
  id: string;
  text: string;
  timestamp: string;
  author?: {
    username?: string;
    displayName?: string;
    pfp?: string;
  };
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
        const response = await fetch(`https://api.farcaster.xyz/v2/casts?username=${encodeURIComponent(handle)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch casts: ${response.status}`);
        }
        
        const data = await response.json();
        setCasts(data.casts || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Farcaster casts:', err);
        setError('Unable to load casts');
        setLoading(false);
      }
    };

    fetchCasts();
  }, [handle]);

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
            {casts.slice(0, 5).map((cast) => (
              <div key={cast.id} className="cast bg-slate-300 rounded-md p-3">
                <p className="text-sm mb-2">{cast.text}</p>
                <div className="flex justify-between items-center text-xs text-gray-600">
                  <span>{new Date(cast.timestamp).toLocaleString()}</span>
                  {cast.author?.username && (
                    <span>@{cast.author.username}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarcasterCasts;
