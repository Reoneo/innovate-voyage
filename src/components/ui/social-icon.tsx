
import React from 'react';
import { Github, Twitter, Linkedin, Globe, Mail, Facebook, MessageCircle, Instagram, Youtube, MessageSquare, ExternalLink, Phone, MapPin, Link, Rss } from 'lucide-react';

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
  const iconClasses = `${className}`;
  
  switch (type) {
    case 'github':
      return <Github size={size} className={`text-gray-800 ${iconClasses}`} />;
    case 'twitter':
      return <Twitter size={size} className={`text-blue-400 ${iconClasses}`} />;
    case 'linkedin':
      return <Linkedin size={size} className={`text-blue-700 ${iconClasses}`} />;
    case 'globe':
    case 'website':
      return <Globe size={size} className={`text-green-600 ${iconClasses}`} />;
    case 'mail':
    case 'email':
      return <Mail size={size} className={`text-purple-500 ${iconClasses}`} />;
    case 'facebook':
      return <Facebook size={size} className={`text-blue-600 ${iconClasses}`} />;
    case 'whatsapp':
      return (
        <div className={`text-green-500 ${iconClasses}`}>
          <img 
            src="https://cdn.worldvectorlogo.com/logos/whatsapp-3.svg" 
            width={size} 
            height={size} 
            alt="WhatsApp"
          />
        </div>
      );
    case 'messenger':
      return <MessageCircle size={size} className={`text-blue-500 ${iconClasses}`} />;
    case 'bluesky':
      return (
        <div className={`text-blue-500 ${iconClasses}`}>
          <img 
            src="https://cdn.worldvectorlogo.com/logos/bluesky-1.svg" 
            width={size} 
            height={size} 
            alt="Bluesky"
          />
        </div>
      );
    case 'instagram':
      return <Instagram size={size} className={`text-pink-600 ${iconClasses}`} />;
    case 'youtube':
      return <Youtube size={size} className={`text-red-600 ${iconClasses}`} />;
    case 'telegram':
      return <MessageCircle size={size} className={`text-blue-400 ${iconClasses}`} />;
    case 'reddit':
      return <div className={`text-orange-600 ${iconClasses}`} style={{ fontSize: `${size * 0.8}px`, fontWeight: 'bold' }}>R</div>;
    case 'discord':
      // Using a custom icon for Discord
      return (
        <div className={`text-indigo-600 ${iconClasses}`} style={{ fontSize: `${size * 0.8}px`, fontWeight: 'bold' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.883-.608 1.283a18.565 18.565 0 0 0-5.487 0c-.164-.4-.397-.893-.617-1.283a.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.49a.07.07 0 0 0-.032.028C.533 9.09-.32 13.555.099 17.961a.08.08 0 0 0 .031.055c1.996 1.482 3.922 2.381 5.803 2.981a.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106c-.631-.236-1.235-.52-1.82-.838a.077.077 0 0 1-.008-.128c.122-.091.244-.186.36-.284a.074.074 0 0 1 .078-.01c3.927 1.784 8.18 1.784 12.061 0a.074.074 0 0 1 .078.01c.118.098.24.193.36.284a.077.077 0 0 1-.006.127c-.585.319-1.19.602-1.82.838a.076.076 0 0 0-.041.107c.36.698.772 1.363 1.225 1.993a.076.076 0 0 0 .084.028c1.89-.6 3.817-1.498 5.812-2.98a.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.029zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z"/>
          </svg>
        </div>
      );
    case 'phone':
      return <Phone size={size} className={`text-emerald-600 ${iconClasses}`} />;
    case 'location':
      return <MapPin size={size} className={`text-rose-500 ${iconClasses}`} />;
    case 'farcaster':
      return (
        <div className={`text-purple-600 ${iconClasses}`} style={{ fontSize: `${size * 0.8}px`, fontWeight: 'bold' }}>
          <span role="img" aria-label="purple hex" style={{ fontSize: `${size * 0.8}px` }}>
            ⬡
          </span>
        </div>
      );
    case 'lens':
      return (
        <div className={`text-green-600 ${iconClasses}`} style={{ fontSize: `${size * 0.8}px`, fontWeight: 'bold' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 32 32" fill="currentColor">
            <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0zm8.4 14.47L22.18 16l2.22 1.53c.4.28.51.83.24 1.24a.91.91 0 01-1.24.24L19.2 15.89c-.18-.13-.31-.31-.36-.52v-.02c-.07-.21-.05-.43.05-.63s.26-.37.47-.45c.2-.08.43-.07.64.01l4.16 1.65c.4.16.87-.03 1.03-.43.16-.4-.03-.87-.43-1.03l-4.16-1.65c-.63-.25-1.32-.21-1.91.12s-1.01.88-1.18 1.52c-.17.64-.05 1.33.33 1.9.26.41.65.72 1.11.93l5.26 2.09c.12.05.25.07.38.07.31 0 .6-.17.76-.46.27-.54.05-1.2-.49-1.47l-.4-.17zM19.81 3.47c-3.4-.04-6.72.93-9.19 3.09-.39.34-.43.92-.09 1.32.34.39.93.44 1.32.09a13.92 13.92 0 018.09-2.72c7.34 0 13.47 5.78 13.47 13.02s-5.88 13.01-13.22 13.01c-3.41.02-6.77-.99-9.09-3.33-.34-.34-.93-.34-1.27 0s-.35.92 0 1.28c2.6 2.55 6.32 3.83 10.07 3.91h.36c8.35 0 14.89-6.16 14.89-14.69.01-8.2-7.03-14.81-15.34-14.98z" />
          </svg>
        </div>
      );
    case 'opensea':
      return (
        <div className={`text-blue-600 ${iconClasses}`} style={{ fontSize: `${size * 0.8}px`, fontWeight: 'bold' }}>
          <span role="img" aria-label="wave" style={{ fontSize: `${size * 0.8}px` }}>
            🌊
          </span>
        </div>
      );
    default:
      return <ExternalLink size={size} className={`text-gray-500 ${iconClasses}`} />;
  }
};
