
import React from 'react';

interface NetworkLinkProps {
  link: {
    source: any;
    target: any;
    value: number;
  };
  getNodeById: (id: string) => any;
}

const NetworkLink: React.FC<NetworkLinkProps> = ({ link, getNodeById }) => {
  // Make sure link.source and link.target are not null before accessing properties
  if (!link.source || !link.target) {
    return null;
  }
  
  // Handle both string id and object cases
  const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
  const sourceNode = getNodeById(sourceId);
  
  const targetId = typeof link.target === 'string' ? link.target : link.target.id;
  const targetNode = getNodeById(targetId);
  
  // Make sure both nodes exist
  if (!sourceNode || !targetNode) {
    return null;
  }

  return (
    <line
      stroke={link.value > 3 ? "#6366f1" : "#9ca3af"}
      strokeWidth={Math.sqrt(link.value) * 1.5}
      strokeOpacity={0.7}
      x1={sourceNode.x}
      y1={sourceNode.y}
      x2={targetNode.x}
      y2={targetNode.y}
    />
  );
};

export default NetworkLink;
