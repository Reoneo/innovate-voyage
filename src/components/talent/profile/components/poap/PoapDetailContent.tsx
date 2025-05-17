
import React from 'react';
import { Poap } from '@/api/services/poapService';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from "@/components/ui/skeleton";
import PoapOwnerItem from './PoapOwnerItem';

interface PoapDetailContentProps {
  poap: Poap;
  poapOwners: any[];
  loadingOwners: boolean;
}

const PoapDetailContent: React.FC<PoapDetailContentProps> = ({
  poap,
  poapOwners,
  loadingOwners
}) => {
  return (
    <div className="space-y-4">
      <img src={poap.event.image_url} alt={poap.event.name} className="w-32 h-32 mx-auto object-contain" />
      <div className="space-y-2">
        <p className="text-sm">{poap.event.description}</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-xs text-muted-foreground">Token ID</p>
            <p className="text-sm font-medium">#{poap.tokenId}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Supply</p>
            <p className="text-sm font-medium">{poap.event.supply || "Unlimited"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="text-sm font-medium">
              {new Date(poap.event.start_date).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Chain</p>
            <p className="text-sm font-medium">{poap.chain}</p>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2">POAP Owners ({poapOwners.length})</h3>
          
          {loadingOwners ? (
            <div className="flex flex-col space-y-2">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          ) : poapOwners && poapOwners.length > 0 ? (
            <div className="max-h-48 overflow-y-auto space-y-2">
              {poapOwners.map((owner, index) => (
                <PoapOwnerItem key={`${owner.owner}-${index}`} owner={owner} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No other owners found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoapDetailContent;
