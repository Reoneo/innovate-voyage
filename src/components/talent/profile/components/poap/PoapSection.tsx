
import React, { useEffect, useState } from 'react';
import PoapCard from './PoapCard';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PoapSectionProps {
  walletAddress?: string;
}

interface Poap {
  event: {
    id: number;
    name: string;
    description: string;
    image_url: string;
    country: string;
    city: string;
    start_date: string;
    end_date: string;
    year: number;
  };
  tokenId: string;
}

// Remove Card/box, style with glassy background and no border
const containerClasses = "rounded-xl bg-gradient-to-br from-[#1A1F2C]/80 via-[#7E69AB]/30 to-[#0FA0CE]/20 shadow-[0_2px_10px_#3f397cee,0_0px_0px_#7E69AB00_inset] p-0";

const PoapSection: React.FC<PoapSectionProps> = ({ walletAddress }) => {
  const [poaps, setPoaps] = useState<Poap[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPoaps = async () => {
      if (!walletAddress) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.poap.tech/actions/scan/${walletAddress}`, {
          headers: {
            'Accept': 'application/json',
            'X-API-Key': '7xwPLTiwF4NAxB24aX2uu0iQZyB6Ixbp2m5hjHxqfUWs6UNQa4qvmn7anDDLOSrv'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setPoaps(data);
        } else {
          console.error('Failed to fetch POAPs:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching POAPs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPoaps();
  }, [walletAddress]);

  if (!walletAddress) {
    return null;
  }

  return (
    <section id="poap-section" className={containerClasses}>
      <CardHeader className="pb-2 bg-transparent">
        <CardTitle className="flex items-center justify-center text-xl font-semibold text-gradient-primary tracking-wide">
          Proof of Attendance
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 rounded-lg animate-pulse bg-gradient-to-r from-gray-300/20 to-gray-300/30"></div>
            ))}
          </div>
        ) : poaps.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {poaps.map((poap) => (
              <PoapCard 
                key={poap.tokenId} 
                name={poap.event.name}
                imageUrl={poap.event.image_url}
                date={new Date(poap.event.start_date).toLocaleDateString()}
                location={poap.event.city || poap.event.country}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No POAP tokens found
          </div>
        )}
      </CardContent>
    </section>
  );
};

export default PoapSection;
