
import React, { useState } from 'react';
import { ExternalLink, CircleUser, Hash, Calendar, Users } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { type Poap } from '@/api/services/poapService';

interface PoapCardProps {
  poap: Poap;
  detailed?: boolean;
}

const PoapCard: React.FC<PoapCardProps> = ({ poap, detailed = false }) => {
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

  // Generate the correct POAP collector URL
  const getPoapCollectorUrl = () => {
    return `https://collectors.poap.xyz/token/${poap.tokenId}`;
  };

  if (detailed) {
    return (
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full" onClick={() => setIsOpen(true)}>
        {/* Left side - POAP image */}
        <div className="relative cursor-pointer group mx-auto md:mx-0">
          <div className="w-32 h-32 md:w-40 md:h-40 overflow-hidden rounded-full border-2 border-primary/20 transition-all duration-200 group-hover:border-primary/50 group-hover:shadow-md">
            <img 
              src={poap.event.image_url} 
              alt={poap.event.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Right side - POAP details */}
        <div className="flex flex-col justify-center flex-grow">
          <h3 className="text-xl font-semibold mb-1">{poap.event.name}</h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{poap.event.description || "No description available"}</p>
          
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
            <div className="flex items-center gap-1.5">
              <Hash className="h-4 w-4 text-primary" />
              <span>POAP ID: #{poap.tokenId}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{formatDate(poap.event.start_date)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CircleUser className="h-4 w-4 text-primary" />
              <span>Minted by: {poap.event.fancy_id || "Unknown"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" />
              <span>Supply: {poap.event.supply || "Unlimited"}</span>
            </div>
          </div>
          
          <div className="flex gap-2 mt-3">
            <Badge variant="outline" className="bg-primary/5">#1</Badge>
            <Badge variant="outline" className="bg-primary/5">2</Badge>
            <Badge variant="outline" className="bg-primary/5">1</Badge>
          </div>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-center text-xl">{poap.event.name}</DialogTitle>
              <DialogDescription className="text-center flex justify-center">
                <Badge variant="outline" className="mt-1">ID #{poap.tokenId}</Badge>
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex justify-center mb-4">
              <div className="w-80 h-80 overflow-hidden rounded-full border-2 border-primary/20">
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
                  href={getPoapCollectorUrl()} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm flex items-center"
                >
                  View on POAP.xyz
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div 
      className="relative cursor-pointer group"
      onClick={() => setIsOpen(true)}
    >
      <div className="w-40 h-40 overflow-hidden rounded-full border-2 border-primary/20 transition-all duration-200 group-hover:border-primary/50 group-hover:shadow-md">
        <img 
          src={poap.event.image_url} 
          alt={poap.event.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-full transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
        <ExternalLink className="w-5 h-5 text-white" />
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">{poap.event.name}</DialogTitle>
            <DialogDescription className="text-center flex justify-center">
              <Badge variant="outline" className="mt-1">ID #{poap.tokenId}</Badge>
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-center mb-4">
            <div className="w-80 h-80 overflow-hidden rounded-full border-2 border-primary/20">
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
                href={getPoapCollectorUrl()} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm flex items-center"
              >
                View on POAP.xyz
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PoapCard;
