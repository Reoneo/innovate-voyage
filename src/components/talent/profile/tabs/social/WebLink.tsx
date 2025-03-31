
import React from 'react';
import { Globe } from 'lucide-react';

interface WebLinkProps {
  url: string;
}

const WebLink: React.FC<WebLinkProps> = ({ url }) => {
  let displayUrl = '';
  
  try {
    displayUrl = new URL(url).hostname;
  } catch (e) {
    displayUrl = url;
  }
  
  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4" />
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
        data-social-link="web"
      >
        {displayUrl}
      </a>
    </div>
  );
};

export default WebLink;
