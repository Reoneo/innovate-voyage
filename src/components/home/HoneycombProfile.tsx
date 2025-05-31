
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
        }
      } catch (error) {
        console.error(`Error fetching avatar for ${ensName}:`, error);
        // For .box domains, use the uploaded image as fallback
        if (ensName.endsWith('.box')) {
          setAvatarUrl('/lovable-uploads/dc30762d-edb6-4e72-abf3-e78015f90b1d.png');
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
      <div
        style={{
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
        }}
      >
        <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center p-2">
          <Avatar className="w-14 h-14 md:w-16 md:h-16 border-2 border-blue-400/50 hover:border-blue-400 transition-all duration-300">
            <AvatarImage 
              src={avatarUrl} 
              alt={`${ensName} avatar`} 
              className="object-cover"
            />
            <AvatarFallback className="bg-slate-700 text-slate-300 text-xs font-medium">
              {ensName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
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
