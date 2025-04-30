
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
      return <img src="https://img.icons8.com/?size=100&id=16713&format=png&color=000000" width={iconSize} height={iconSize} alt="WhatsApp" className={iconClasses} />;
    case 'messenger':
      return <img src="https://cdn-icons-png.flaticon.com/512/5968/5968772.png" width={iconSize} height={iconSize} alt="Messenger" className={iconClasses} />;
    case 'bluesky':
      return (
        <svg 
          role="img" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg" 
          width={iconSize} 
          height={iconSize} 
          className={iconClasses}
          fill="#00b3ff"
        >
          <title>Bluesky</title>
          <path d="M12 10.8c-1.087 -2.114 -4.046 -6.053 -6.798 -7.995C2.566 0.944 1.561 1.266 0.902 1.565 0.139 1.908 0 3.08 0 3.768c0 0.69 0.378 5.65 0.624 6.479 0.815 2.736 3.713 3.66 6.383 3.364 0.136 -0.02 0.275 -0.039 0.415 -0.056 -0.138 0.022 -0.276 0.04 -0.415 0.056 -3.912 0.58 -7.387 2.005 -2.83 7.078 5.013 5.19 6.87 -1.113 7.823 -4.308 0.953 3.195 2.05 9.271 7.733 4.308 4.267 -4.308 1.172 -6.498 -2.74 -7.078a8.741 8.741 0 0 1 -0.415 -0.056c0.14 0.017 0.279 0.036 0.415 0.056 2.67 0.297 5.568 -0.628 6.383 -3.364 0.246 -0.828 0.624 -5.79 0.624 -6.478 0 -0.69 -0.139 -1.861 -0.902 -2.206 -0.659 -0.298 -1.664 -0.62 -4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z" />
        </svg>
      );
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
