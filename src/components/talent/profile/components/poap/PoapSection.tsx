
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import PoapCard from './PoapCard';

interface PoapSectionProps {
  walletAddress?: string;
}

const PoapSection: React.FC<PoapSectionProps> = ({ walletAddress }) => {
  const [poaps, setPoaps] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const fetchPoaps = async () => {
      if (!walletAddress) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.poap.tech/actions/scan/${walletAddress}`, {
          headers: {
            'Accept': 'application/json',
            'X-API-Key': process.env.POAP_API_KEY || ''
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setPoaps(data.slice(0, 10)); // Limit to 10 POAPs
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
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Increased the icon size by 50% from h-6 w-6 to h-9 w-9 */}
            <Award className="h-9 w-9 text-primary" />
            <CardTitle>Proof of Attendance</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Loading POAPs...</p>
          </div>
        ) : poaps.length > 0 ? (
          <div className="flex overflow-x-auto gap-4 scrollbar-hide py-2">
            {poaps.map((poap, index) => (
              <PoapCard key={index} poap={poap} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No POAPs found for this address.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PoapSection;
