import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';
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
}

const PoapCard: React.FC<PoapCardProps> = ({ poap }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className="relative cursor-pointer group w-48 h-48"
        onClick={() => setIsOpen(true)}
      >
        <div className="w-full h-full overflow-hidden rounded-full transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(155,135,245,0.3)]">
          <img 
            src={poap.event.image_url} 
            alt={poap.event.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-full transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <ExternalLink className="w-6 h-6 text-white" />
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
    </>
  );
};

export default PoapCard;
