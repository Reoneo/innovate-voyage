
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { type Poap } from '@/api/services/poapService';

interface PoapCardProps {
  poap: Poap;
}

const PoapCard: React.FC<PoapCardProps> = ({ poap }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <div 
        className="relative cursor-pointer group"
        onClick={() => setIsOpen(true)}
      >
        <div className="w-24 h-24 overflow-hidden rounded-full border-2 border-primary/20 transition-all duration-200 group-hover:border-primary/50 group-hover:shadow-md animate-pulse">
          <img 
            src={poap.event.image_url} 
            alt={poap.event.name} 
            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
          />
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">{poap.event.name}</DialogTitle>
            <DialogDescription className="text-center flex justify-center">
              <Badge variant="outline" className="mt-1">ID #{poap.tokenId}</Badge>
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 overflow-hidden rounded-full border-2 border-primary/20">
              <img 
                src={poap.event.image_url} 
                alt={poap.event.name}
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Description</h4>
              <p className="text-sm text-muted-foreground">
                {poap.event.description || "No description available"}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <h4 className="font-medium mb-1">Event Date</h4>
                <p className="text-muted-foreground">
                  {formatDate(poap.event.start_date)}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Year</h4>
                <p className="text-muted-foreground">{poap.event.year}</p>
              </div>
              {poap.event.city && (
                <div>
                  <h4 className="font-medium mb-1">Location</h4>
                  <p className="text-muted-foreground">
                    {poap.event.city}, {poap.event.country}
                  </p>
                </div>
              )}
              <div>
                <h4 className="font-medium mb-1">Supply</h4>
                <p className="text-muted-foreground">{poap.event.supply || "Unlimited"}</p>
              </div>
            </div>
            
            <div className="pt-2">
              <a 
                href={`https://poap.gallery/drops/${poap.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                View on POAP.xyz
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PoapCard;
