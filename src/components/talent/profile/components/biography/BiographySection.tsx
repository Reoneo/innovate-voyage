
import React, { useState, useEffect } from 'react';
import { getEnsBio } from '@/utils/ens/ensRecords';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    <Card id="bio-card-section" className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Bio
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading bio...</p>
        ) : biography ? (
          <p className="text-muted-foreground text-sm whitespace-pre-wrap break-words">
            {biography}
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">No bio available</p>
        )}
      </CardContent>
    </Card>
  );
};

export default BiographySection;
