import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
interface HoneycombProfileProps {
  ensName: string;
  delay?: number;
  showName?: boolean;
}
const HoneycombProfile: React.FC<HoneycombProfileProps> = ({
  ensName,
  delay = 0,
  showName = true
}) => {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if this is a 10k ENS Club profile (numeric.eth) or .box user
  const isEnsClub = ensName.endsWith('.eth') && /^\d+\.eth$/.test(ensName);
  const isBoxUser = ensName.endsWith('.box');
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        // Try ENS metadata service first
        const metadataUrl = `https://metadata.ens.domains/mainnet/avatar/${ensName}`;
        const response = await fetch(metadataUrl, {
          method: 'HEAD'
        });
        if (response.ok) {
          setAvatarUrl(metadataUrl);
        } else if (isBoxUser) {
          // Use the .box community avatar as fallback for .box domains
          setAvatarUrl('/lovable-uploads/dc30762d-edb6-4e72-abf3-e78015f90b1d.png');
        } else if (isEnsClub) {
          // For 10k ENS Club (numeric.eth), use the preview endpoint as fallback
          setAvatarUrl(`https://metadata.ens.domains/preview/${ensName}`);
        }
      } catch (error) {
        console.error(`Error fetching avatar for ${ensName}:`, error);
        // Apply fallbacks based on domain type
        if (isBoxUser) {
          setAvatarUrl('/lovable-uploads/dc30762d-edb6-4e72-abf3-e78015f90b1d.png');
        } else if (isEnsClub) {
          setAvatarUrl(`https://metadata.ens.domains/preview/${ensName}`);
        }
      } finally {
        setTimeout(() => setIsLoaded(true), delay);
      }
    };
    fetchAvatar();
  }, [ensName, delay, isBoxUser, isEnsClub]);
  const handleClick = () => {
    navigate(`/${ensName}`);
    toast.success(`Loading ${ensName} profile`);
  };
  return <div onClick={handleClick} className="">
      {/* Square container with avatar filling it - conditional rounded corners for ENS Club and .box users */}
      <div className={`w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-400/30 hover:border-blue-400 transition-all duration-300 overflow-hidden ${isEnsClub || isBoxUser ? '' : 'rounded-lg'}`}>
        <Avatar className={`w-full h-full ${isEnsClub || isBoxUser ? '' : 'rounded-lg'}`}>
          <AvatarImage src={avatarUrl} alt={`${ensName} avatar`} className="" />
          <AvatarFallback className={`bg-slate-700 text-slate-300 text-xs font-medium w-full h-full flex items-center justify-center ${isEnsClub || isBoxUser ? '' : 'rounded-lg'}`}>
            {ensName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      
      {/* Profile Name */}
      {showName && <div className="mt-2 text-center">
          <p className="text-xs text-slate-300 font-medium truncate max-w-20 md:max-w-24">
            {ensName}
          </p>
        </div>}
    </div>;
};
export default HoneycombProfile;