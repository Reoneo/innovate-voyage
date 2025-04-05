
import React, { useState, useEffect } from 'react';
import { getEnsBio } from '@/utils/ens/ensRecords';
import { FileText } from 'lucide-react';

interface BiographySectionProps {
  bio?: string;
  identity?: string;
}

const BiographySection: React.FC<BiographySectionProps> = ({ bio, identity }) => {
  const [biography, setBiography] = useState<string | null>(bio || null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If no bio provided and we have an ENS identity, try to fetch it
    if (!biography && identity && (identity.includes('.eth') || identity.includes('.box'))) {
      setIsLoading(true);
      
      getEnsBio(identity)
        .then(fetchedBio => {
          if (fetchedBio) {
            console.log(`Got bio for ${identity}:`, fetchedBio);
            setBiography(fetchedBio);
          }
        })
        .catch(error => {
          console.error(`Error fetching bio for ${identity}:`, error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [biography, identity]);

  return (
    <div className="w-full mt-4">
      <div className="flex items-center gap-2 mb-2">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-medium">Bio</h3>
      </div>
      <div>
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading bio...</p>
        ) : biography ? (
          <p className="text-muted-foreground text-sm whitespace-pre-wrap break-words">
            {biography}
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">No bio available</p>
        )}
      </div>
    </div>
  );
};

export default BiographySection;
