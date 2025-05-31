
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface HoneycombProfileProps {
  ensName: string;
  delay?: number;
  showName?: boolean;
}

const HoneycombProfile: React.FC<HoneycombProfileProps> = ({ ensName, delay = 0, showName = true }) => {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        // Try ENS metadata service first
        const metadataUrl = `https://metadata.ens.domains/mainnet/avatar/${ensName}`;
        const response = await fetch(metadataUrl, { method: 'HEAD' });
        
        if (response.ok) {
          setAvatarUrl(metadataUrl);
        } else if (ensName.endsWith('.box')) {
          // Use the uploaded image as fallback for .box domains
          setAvatarUrl('/lovable-uploads/dc30762d-edb6-4e72-abf3-e78015f90b1d.png');
        } else if (ensName.endsWith('.eth') && /^\d+\.eth$/.test(ensName)) {
          // For 10k ENS Club (numeric.eth), use the preview endpoint as fallback
          setAvatarUrl(`https://metadata.ens.domains/preview/${ensName}`);
        }
      } catch (error) {
        console.error(`Error fetching avatar for ${ensName}:`, error);
        // Apply fallbacks based on domain type
        if (ensName.endsWith('.box')) {
          setAvatarUrl('/lovable-uploads/dc30762d-edb6-4e72-abf3-e78015f90b1d.png');
        } else if (ensName.endsWith('.eth') && /^\d+\.eth$/.test(ensName)) {
          setAvatarUrl(`https://metadata.ens.domains/preview/${ensName}`);
        }
      } finally {
        setTimeout(() => setIsLoaded(true), delay);
      }
    };

    fetchAvatar();
  }, [ensName, delay]);

  const handleClick = () => {
    navigate(`/${ensName}`);
    toast.success(`Loading ${ensName} profile`);
  };

  return (
    <div 
      className={`relative cursor-pointer transform transition-all duration-500 hover:scale-110 hover:z-10 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      onClick={handleClick}
    >
      {/* Square container with avatar filling it */}
      <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/30 hover:border-blue-400 transition-all duration-300 overflow-hidden">
        <Avatar className="w-full h-full rounded-lg">
          <AvatarImage 
            src={avatarUrl} 
            alt={`${ensName} avatar`} 
            className="object-cover w-full h-full rounded-lg"
          />
          <AvatarFallback className="bg-slate-700 text-slate-300 text-xs font-medium w-full h-full rounded-lg flex items-center justify-center">
            {ensName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      
      {/* Profile Name */}
      {showName && (
        <div className="mt-2 text-center">
          <p className="text-xs text-slate-300 font-medium truncate max-w-20 md:max-w-24">
            {ensName}
          </p>
        </div>
      )}
    </div>
  );
};

export default HoneycombProfile;
