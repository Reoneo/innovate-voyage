
import React from 'react';
import { Phone, MapPin, ExternalLink } from 'lucide-react';

type SocialIconType = 'github' | 'twitter' | 'linkedin' | 'globe' | 'mail' | 'facebook' | 'whatsapp' | 'messenger' | 'bluesky' | 'instagram' | 'youtube' | 'telegram' | 'reddit' | 'discord' | 'website' | 'email' | 'phone' | 'location';

interface SocialIconProps {
  type: SocialIconType;
  size?: number;
  className?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ 
  type, 
  size = 24,
  className = ""
}) => {
  const iconClasses = `${className}`;
  const iconSize = `${size}px`;
  
  switch (type) {
    case 'github':
      return <img src="https://cdn-icons-png.flaticon.com/512/1051/1051326.png" width={iconSize} height={iconSize} alt="GitHub" className={iconClasses} />;
    case 'twitter':
      return <img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" width={iconSize} height={iconSize} alt="Twitter" className={iconClasses} />;
    case 'linkedin':
      return <img src="https://cdn-icons-png.flaticon.com/512/145/145807.png" width={iconSize} height={iconSize} alt="LinkedIn" className={iconClasses} />;
    case 'facebook':
      return <img src="https://cdn-icons-png.flaticon.com/512/5968/5968764.png" width={iconSize} height={iconSize} alt="Facebook" className={iconClasses} />;
    case 'instagram':
      return <img src="https://cdn-icons-png.flaticon.com/512/15707/15707749.png" width={iconSize} height={iconSize} alt="Instagram" className={iconClasses} />;
    case 'youtube':
      return <img src="https://cdn-icons-png.flaticon.com/512/3670/3670147.png" width={iconSize} height={iconSize} alt="YouTube" className={iconClasses} />;
    case 'telegram':
      return <img src="https://cdn-icons-png.flaticon.com/512/5968/5968804.png" width={iconSize} height={iconSize} alt="Telegram" className={iconClasses} />;
    case 'bluesky':
      return <img src="https://www.iconpacks.net/icons/free-icons-7/free-bluesky-blue-round-circle-logo-icon-24461.png" width={iconSize} height={iconSize} alt="Bluesky" className={iconClasses} />;
    case 'whatsapp':
      return <img src="https://cdn-icons-png.flaticon.com/512/5968/5968841.png" width={iconSize} height={iconSize} alt="WhatsApp" className={iconClasses} />;
    case 'location':
      return <img src="https://cdn-icons-png.flaticon.com/512/355/355980.png" width={iconSize} height={iconSize} alt="Location" className={iconClasses} />;
    case 'globe':
    case 'website':
      return <img src="https://cdn-icons-png.flaticon.com/512/3059/3059997.png" width={iconSize} height={iconSize} alt="Website" className={iconClasses} />;
    case 'mail':
    case 'email':
      return <img src="https://cdn-icons-png.flaticon.com/512/542/542638.png" width={iconSize} height={iconSize} alt="Email" className={iconClasses} />;
    case 'discord':
      return <img src="https://cdn-icons-png.flaticon.com/512/5968/5968756.png" width={iconSize} height={iconSize} alt="Discord" className={iconClasses} />;
    case 'phone':
      return <Phone size={size} className={`text-emerald-600 ${iconClasses}`} />;
    case 'reddit':
      return <img src="https://cdn-icons-png.flaticon.com/512/5968/5968944.png" width={iconSize} height={iconSize} alt="Reddit" className={iconClasses} />;
    default:
      return <ExternalLink size={size} className={`text-gray-500 ${iconClasses}`} />;
  }
};
