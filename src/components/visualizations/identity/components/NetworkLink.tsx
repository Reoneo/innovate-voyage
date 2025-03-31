
import React from 'react';

interface NetworkLinkProps {
  link: {
    source: any;
    target: any;
    id?: string;
  };
}

const NetworkLink: React.FC<NetworkLinkProps> = ({ link }) => {
  // This component is kept as a placeholder to prevent build errors
  // Since visualizations were removed, we're providing a minimal implementation
  
  return null;
};

export default NetworkLink;
