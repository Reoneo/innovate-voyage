
import React, { useState, useEffect } from 'react';
import { DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, ExternalLink, X } from 'lucide-react';
import { fetchPoapEventOwners } from '@/api/services/poapService';
import { Skeleton } from '@/components/ui/skeleton';
import PoapOwnerItem from './PoapOwnerItem';
import type { Poap } from '@/api/services/poapService';

interface PoapDetailContentProps {
  poap: Poap;
}

const PoapDetailContent: React.FC<PoapDetailContentProps> = ({ poap }) => {
  const [owners, setOwners] = useState<any[]>([]);
  const [loadingOwners, setLoadingOwners] = useState(true);

  useEffect(() => {
    const loadOwners = async () => {
      try {
        const ownersData = await fetchPoapEventOwners(poap.event.id);
        setOwners(ownersData);
      } catch (error) {
        console.error('Error fetching POAP owners:', error);
      } finally {
        setLoadingOwners(false);
      }
    };

    loadOwners();
  }, [poap.event.id]);

  return (
    <div className="flex flex-col h-full">
      <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50">
        <X className="h-6 w-6" />
        <span className="sr-only">Close</span>
      </DialogClose>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4">
              <img 
                src={poap.event.image_url} 
                alt={poap.event.name}
                className="w-32 h-32 rounded-full object-cover mx-auto shadow-lg"
              />
            </div>
            <DialogTitle className="text-2xl font-bold">{poap.event.name}</DialogTitle>
          </DialogHeader>

          {/* Event Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {poap.event.description && (
                <p className="text-gray-700">{poap.event.description}</p>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Date:</span>
                    <span>{new Date(poap.event.start_date).toLocaleDateString()}</span>
                  </div>
                  
                  {(poap.event.city || poap.event.country) && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">Location:</span>
                      <span>{[poap.event.city, poap.event.country].filter(Boolean).join(', ')}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Supply:</span>
                    <span>{poap.event.supply.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="secondary">#{poap.tokenId}</Badge>
                  </div>
                </div>
              </div>

              {poap.event.event_url && (
                <a 
                  href={poap.event.event_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-500 hover:underline"
                >
                  View Event <ExternalLink size={14} />
                </a>
              )}
            </CardContent>
          </Card>

          {/* POAP Owners */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                POAP Holders ({loadingOwners ? '...' : owners.length.toLocaleString()})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingOwners ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(9)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : owners.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {owners.slice(0, 100).map((owner, index) => (
                    <PoapOwnerItem key={`${owner.owner || owner.address || index}`} owner={owner} />
                  ))}
                  {owners.length > 100 && (
                    <div className="col-span-full text-center text-gray-500 text-sm mt-4">
                      Showing first 100 of {owners.length.toLocaleString()} holders
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No holders data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PoapDetailContent;
