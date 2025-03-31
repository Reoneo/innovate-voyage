
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TokenFilterBadgesProps {
  tokens: any[];
  activeToken: string | null;
  setActiveToken: (token: string | null) => void;
}

const TokenFilterBadges: React.FC<TokenFilterBadgesProps> = ({ 
  tokens, 
  activeToken, 
  setActiveToken 
}) => {
  if (tokens.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2">
      <Badge 
        variant={activeToken === null ? "secondary" : "outline"}
        className="cursor-pointer"
        onClick={() => setActiveToken(null)}
      >
        All
      </Badge>
      {tokens.map((token, idx) => (
        <Badge 
          key={idx}
          variant={activeToken === token.symbol ? "secondary" : "outline"}
          className="cursor-pointer"
          onClick={() => setActiveToken(token.symbol)}
        >
          {token.symbol}
        </Badge>
      ))}
    </div>
  );
};

export default TokenFilterBadges;
