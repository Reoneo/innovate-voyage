
import React from 'react';
import { Phone, MapPin, ExternalLink } from 'lucide-react';

type SocialIconType = 'github' | 'twitter' | 'linkedin' | 'globe' | 'mail' | 'facebook' | 'whatsapp' | 'messenger' | 'bluesky' | 'instagram' | 'youtube' | 'telegram' | 'reddit' | 'discord' | 'website' | 'email' | 'phone' | 'location' | 'farcaster' | 'lens' | 'opensea';

interface SocialIconProps {
  type: SocialIconType;
  size?: number;
  className?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ 
  type, 
  size = 20,
  className = ""
}) => {
  // Apply 15% reduction to size
  const adjustedSize = Math.round(size * 0.85);
  const iconSize = `${adjustedSize}px`;
  const iconClasses = `${className}`;
  
  switch (type) {
    case 'github':
      return <img src="https://cdn-icons-png.flaticon.com/512/1051/1051326.png" width={iconSize} height={iconSize} alt="GitHub" className={iconClasses} />;
    case 'twitter':
      return <img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" width={iconSize} height={iconSize} alt="Twitter" className={iconClasses} />;
    case 'linkedin':
      return <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" width={iconSize} height={iconSize} alt="LinkedIn" className={iconClasses} />;
    case 'globe':
    case 'website':
      return <img src="https://cdn-icons-png.flaticon.com/512/3059/3059997.png" width={iconSize} height={iconSize} alt="Website" className={iconClasses} />;
    case 'mail':
    case 'email':
      return <img src="https://cdn-icons-png.flaticon.com/512/542/542638.png" width={iconSize} height={iconSize} alt="Email" className={iconClasses} />;
    case 'facebook':
      return <img src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png" width={iconSize} height={iconSize} alt="Facebook" className={iconClasses} />;
    case 'whatsapp':
      return <img src="https://cdn-icons-png.flaticon.com/512/5968/5968841.png" width={iconSize} height={iconSize} alt="WhatsApp" className={iconClasses} />;
    case 'messenger':
      return <img src="https://cdn-icons-png.flaticon.com/512/5968/5968772.png" width={iconSize} height={iconSize} alt="Messenger" className={iconClasses} />;
    case 'bluesky':
      return <img src="https://www.iconpacks.net/icons/free-icons-7/free-bluesky-blue-round-circle-logo-icon-24461.png" width={iconSize} height={iconSize} alt="Bluesky" className={iconClasses} />;
    case 'instagram':
      return <img src="https://cdn-icons-png.flaticon.com/512/15707/15707749.png" width={iconSize} height={iconSize} alt="Instagram" className={iconClasses} />;
    case 'youtube':
      return <img src="https://cdn-icons-png.flaticon.com/512/3670/3670147.png" width={iconSize} height={iconSize} alt="YouTube" className={iconClasses} />;
    case 'telegram':
      return <img src="https://cdn-icons-png.flaticon.com/512/5968/5968804.png" width={iconSize} height={iconSize} alt="Telegram" className={iconClasses} />;
    case 'reddit':
      return <img src="https://cdn-icons-png.flaticon.com/512/5968/5968944.png" width={iconSize} height={iconSize} alt="Reddit" className={iconClasses} />;
    case 'discord':
      return <img src="https://cdn-icons-png.flaticon.com/512/5968/5968756.png" width={iconSize} height={iconSize} alt="Discord" className={iconClasses} />;
    case 'phone':
      return <Phone size={adjustedSize} className={`text-emerald-600 ${iconClasses}`} />;
    case 'location':
      return <img src="https://cdn-icons-png.flaticon.com/512/355/355980.png" width={iconSize} height={iconSize} alt="Location" className={iconClasses} />;
    case 'farcaster':
      return <img src="https://cdn-icons-png.flaticon.com/512/5968/5968872.png" width={iconSize} height={iconSize} alt="Farcaster" className={iconClasses} />;
    case 'lens':
      return <img src="https://cdn-icons-png.flaticon.com/512/5968/5968770.png" width={iconSize} height={iconSize} alt="Lens" className={iconClasses} />;
    case 'opensea':
      return <img src="https://cdn-icons-png.flaticon.com/512/6001/6001356.png" width={iconSize} height={iconSize} alt="OpenSea" className={iconClasses} />;
    default:
      return <ExternalLink size={adjustedSize} className={`text-gray-500 ${iconClasses}`} />;
  }
};
