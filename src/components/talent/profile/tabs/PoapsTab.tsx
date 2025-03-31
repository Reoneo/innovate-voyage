
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Globe, ExternalLink, AlertCircle } from 'lucide-react';
import type { POAP } from '@/api/types/poapTypes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PoapsTabProps {
  poaps: POAP[] | undefined;
  isLoading?: boolean;
}

const PoapsTab: React.FC<PoapsTabProps> = ({ poaps, isLoading = false }) => {
  // Check if all POAPs are mock data
  const allMockData = poaps?.length ? 
    poaps.every(poap => 
      poap.event.name.includes('Mock') || 
      poap.event.fancy_id.includes('mock') ||
      poap.event.fancy_id.includes('etherscan')
    ) : false;

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="bg-muted rounded-md h-16 w-16"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!poaps || poaps.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="text-center py-8 text-muted-foreground">
          No POAPs found for this address
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {allMockData && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Using derived POAP data. These may not represent actual POAPs.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4 overflow-auto">
        {poaps.map((poap) => (
          <div key={poap.tokenId} className="flex flex-col sm:flex-row gap-3 border-b pb-4 last:border-0">
            <div className="flex-shrink-0">
              <img 
                src={poap.event.image_url} 
                alt={poap.event.name} 
                className="w-16 h-16 rounded-md object-cover shadow-sm"
                onError={(e) => {
                  // Fallback if image doesn't load
                  (e.target as HTMLImageElement).src = `https://effigy.im/a/${poap.tokenId}.svg`;
                }}
              />
            </div>
            
            <div className="flex-1 space-y-1">
              <div>
                <h3 className="font-bold text-base">{poap.event.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{poap.event.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-y-1 gap-x-3 text-xs">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                  <span>
                    {new Date(poap.event.start_date).toLocaleDateString()}
                  </span>
                </div>
                
                {(poap.event.city || poap.event.country) && 
                 poap.event.city !== 'Unknown' && 
                 poap.event.country !== 'Unknown' && (
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span>{[poap.event.city, poap.event.country].filter(Boolean).join(', ')}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <Badge variant={poap.event.fancy_id.includes('etherscan') ? "outline" : "default"} className="text-xs">
                  {poap.chain === 'xdai' ? 'POAP' : poap.chain}
                </Badge>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a 
                        href={poap.event.event_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                      >
                        <Globe className="h-3 w-3 mr-1" />
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      {poap.event.fancy_id.includes('etherscan') 
                        ? 'View the transaction on Etherscan' 
                        : 'Open event website'}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PoapsTab;
