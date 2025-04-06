
import React from 'react';
import { 
  Calendar, 
  Map, 
  ExternalLink 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface PoapCardProps {
  poap: {
    name: string;
    tokenId: string;
    city: string;
    country: string;
    image_url: string;
    event_url: string;
    description: string;
    event: {
      start_date: string;
      end_date: string;
    };
  };
}

const PoapCard: React.FC<PoapCardProps> = ({ poap }) => {
  // Format date from ISO string
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get badge text based on event location
  const getBadgeText = () => {
    if (poap.city && poap.country) {
      return `${poap.city}, ${poap.country}`;
    } else if (poap.city) {
      return poap.city;
    } else if (poap.country) {
      return poap.country;
    }
    return 'Virtual';
  };

  // Create link to view on POAP.xyz
  const getPoapExternalLink = () => {
    return `https://collectors.poap.xyz/token/${poap.tokenId}`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative group cursor-pointer transition-all duration-300 transform hover:scale-105">
          <img 
            src={poap.image_url} 
            alt={poap.name} 
            className="h-24 w-24 rounded-full object-cover border-2 border-transparent group-hover:border-primary transition-all"
          />
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
            <span className="text-white text-xs font-medium">View</span>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{poap.name}</DialogTitle>
          <DialogDescription>
            POAP Token ID: {poap.tokenId}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 p-4">
          {/* Increased size for the POAP image in the popup */}
          <img 
            src={poap.image_url} 
            alt={poap.name} 
            className="h-60 w-60 rounded-full object-cover border-4 border-primary/20" 
          />
          
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm">
                {formatDate(poap.event.start_date)}
                {poap.event.end_date !== poap.event.start_date && 
                  ` - ${formatDate(poap.event.end_date)}`
                }
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Map className="h-4 w-4 text-primary" />
              <Badge variant="outline">{getBadgeText()}</Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mt-2">
              {poap.description}
            </p>
            
            <div className="flex justify-center mt-4">
              <a 
                href={getPoapExternalLink()}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline text-sm"
              >
                View on POAP.xyz
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PoapCard;
