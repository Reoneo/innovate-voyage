
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Globe, ExternalLink } from 'lucide-react';
import type { POAP } from '@/api/types/poapTypes';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PoapsTabProps {
  poaps: POAP[] | undefined;
  isLoading?: boolean;
}

const PoapsTab: React.FC<PoapsTabProps> = ({ poaps, isLoading = false }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>POAPs</CardTitle>
          <CardDescription>Loading POAP NFTs...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="bg-muted rounded-md h-24 w-24"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!poaps || poaps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>POAPs</CardTitle>
          <CardDescription>Proof of Attendance Protocol NFTs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No POAPs found for this address
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>POAPs</CardTitle>
        <CardDescription>
          Proof of Attendance Protocol NFTs - digital mementos of events attended
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {poaps.map((poap) => (
            <div key={poap.tokenId} className="flex flex-col sm:flex-row gap-4 border-b pb-6 last:border-0">
              <div className="flex-shrink-0">
                <img 
                  src={poap.event.image_url} 
                  alt={poap.event.name} 
                  className="w-24 h-24 rounded-md object-cover shadow-sm"
                />
              </div>
              
              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="font-bold text-lg">{poap.event.name}</h3>
                  <p className="text-sm text-muted-foreground">{poap.event.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span>
                      {new Date(poap.event.start_date).toLocaleDateString()} - {new Date(poap.event.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {(poap.event.city || poap.event.country) && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{[poap.event.city, poap.event.country].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <Badge variant="outline">{poap.event.year}</Badge>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a 
                          href={poap.event.event_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <Globe className="h-3 w-3 mr-1" />
                          <span className="hidden sm:inline">Visit Event</span>
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        Open event website
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PoapsTab;
