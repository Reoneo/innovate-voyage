
import React, { useState, useEffect } from 'react';

interface LocationDisplayProps {
  ensName?: string;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ ensName }) => {
  const [location, setLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ensName || !ensName.includes('.eth')) return;

    const fetchLocation = async () => {
      setLoading(true);
      try {
        // Clear cache to ensure fresh data
        const timestamp = new Date().getTime();
        const response = await fetch(`https://ensdata.net/${ensName}?ts=${timestamp}`);
        if (response.ok) {
          const data = await response.json();
          // Check if location record exists
          if (data?.texts?.find((item: any) => item.key === 'location')) {
            const locationRecord = data.texts.find((item: any) => item.key === 'location');
            setLocation(locationRecord.value);
          }
        }
      } catch (error) {
        console.error('Error fetching ENS location:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [ensName]);

  if (loading || !location) return null;

  return (
    <div className="text-xs text-center text-muted-foreground mt-1">
      📍 {location}
    </div>
  );
};

export default LocationDisplay;
