
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from 'lucide-react';
import PoapCard from './PoapCard';
import { fetchPoaps } from '@/api/services/poapService';

interface PoapSectionProps {
  walletAddress: string;
}

const PoapSection: React.FC<PoapSectionProps> = ({ walletAddress }) => {
  const [poaps, setPoaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPoaps = async () => {
      if (!walletAddress) return;
      
      setLoading(true);
      try {
        const poapData = await fetchPoaps(walletAddress);
        setPoaps(poapData || []);
      } catch (err) {
        console.error('Error fetching POAPs:', err);
        setError('Failed to load POAPs');
      } finally {
        setLoading(false);
      }
    };
    
    loadPoaps();
  }, [walletAddress]);
  
  // If no POAPs and not loading, don't render the section
  if (poaps.length === 0 && !loading) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Badge className="h-5 w-5 text-primary" />
          <CardTitle className="flex items-center gap-2">
            Proof of Attendance
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
            <span className="ml-2 text-sm text-muted-foreground">Loading POAPs...</span>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-sm text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {poaps.map((poap, index) => (
              <PoapCard key={`poap-${index}`} poap={poap} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PoapSection;
