
import React, { useState, useEffect } from 'react';
import { getEnsBio } from '@/utils/ens/ensRecords';

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
    <div className="w-full mt-4 mb-2 text-center">
      <h3 className="text-lg font-medium mb-2">Bio</h3>
      {isLoading ? (
        <p className="text-muted-foreground italic">Loading bio...</p>
      ) : biography ? (
        <p className="text-muted-foreground whitespace-pre-wrap break-words text-lg">
          {biography}
        </p>
      ) : (
        <p className="text-muted-foreground italic text-lg">No bio available</p>
      )}
    </div>
  );
};

export default BiographySection;
