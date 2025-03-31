
import React from 'react';

interface NetworkLinkProps {
  link: {
    source: any;
    target: any;
    value: number;
    id: string;
  };
  opacity: number;
  highlighted: boolean;
  onClick?: () => void;
}

const NetworkLink: React.FC<NetworkLinkProps> = ({ link, opacity, highlighted, onClick }) => {
  // Ensure source and target have valid coordinates
  const sourceX = link.source?.x || 0;
  const sourceY = link.source?.y || 0;
  const targetX = link.target?.x || 0;
  const targetY = link.target?.y || 0;

  const linkId = link.id || 'link';

  return (
    <line
      x1={sourceX}
      y1={sourceY}
      x2={targetX}
      y2={targetY}
      stroke="#999"
      strokeOpacity={opacity}
      strokeWidth={highlighted ? 3 : 1}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    />
  );
};

export default NetworkLink;
