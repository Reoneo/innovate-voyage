
import React from 'react';
import { useFarcasterCasts } from '@/hooks/useFarcasterCasts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Repeat, Heart } from 'lucide-react';

interface FarcasterCastsSectionProps {
  ensName?: string;
  address?: string;
}

const FarcasterCastsSection: React.FC<FarcasterCastsSectionProps> = ({ ensName, address }) => {
  // Extract username from ENS name or use address
  const username = ensName ? ensName.replace('.eth', '').replace('.box', '') : undefined;
  
  const { casts, user, loading, error } = useFarcasterCasts(username);

  if (!username || error) {
    return null;
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
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
          <div className="text-center text-muted-foreground">Loading Farcaster casts...</div>
        </CardContent>
      </Card>
    );
  }

  if (!user || casts.length === 0) {
    return null;
  }

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts * 1000);
    return date.toLocaleDateString();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <img 
            src="https://developers.moralis.com/wp-content/uploads/web3wiki/166-farcaster/637aede94d31498505bc9412_DpYIEpePqjDcHIbux04cOKhrRwBhi7F0-dBF_JCdCYY.png" 
            alt="Farcaster" 
            className="w-5 h-5"
          />
          Recent Farcaster Casts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {casts.map((cast) => (
          <div key={cast.hash} className="border-b pb-3 last:border-b-0">
            <p className="text-sm mb-2">{cast.text}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>{formatTimestamp(cast.ts)}</span>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span>{cast.replies}</span>
              </div>
              <div className="flex items-center gap-1">
                <Repeat className="w-3 h-3" />
                <span>{cast.recasts}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>{cast.reactions}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default FarcasterCastsSection;
