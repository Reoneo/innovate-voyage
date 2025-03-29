
import React from 'react';

interface NetworkLinkProps {
  link: any;
  onMouseOver: (event: React.MouseEvent, d: any) => void;
  onMouseMove: (event: React.MouseEvent) => void;
  onMouseOut: () => void;
}

const NetworkLink: React.FC<NetworkLinkProps> = ({ 
  link, 
  onMouseOver,
  onMouseMove,
  onMouseOut
}) => {
  const strokeColor = getLinkStrokeColor(link);
  const strokeWidth = Math.sqrt(link.value) * 1.5;
  
  return (
    <line
      x1={link.source.x}
      y1={link.source.y}
      x2={link.target.x}
      y2={link.target.y}
      stroke={strokeColor}
      strokeOpacity={0.7}
      strokeWidth={strokeWidth}
      onMouseOver={(e) => onMouseOver(e, link)}
      onMouseMove={onMouseMove}
      onMouseOut={onMouseOut}
    />
  );
};

function getLinkStrokeColor(link: any): string {
  if (link.source === 0 && link.target === 'ens-node') return "#3b82f6";
  return link.verified ? "#10b981" : "#9ca3af";
}

export default NetworkLink;
