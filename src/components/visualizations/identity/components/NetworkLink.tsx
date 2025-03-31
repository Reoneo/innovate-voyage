
import React from 'react';
import { NetworkLink as NetworkLinkType, NetworkNode } from '../hooks/useIdNetworkData';

interface NetworkLinkProps {
  link: NetworkLinkType;
  nodes: NetworkNode[];
  selectedNode: string | null;
}

const NetworkLink: React.FC<NetworkLinkProps> = ({ link, nodes, selectedNode }) => {
  // Find the target node to determine color, with proper null checking
  const targetId = typeof link.target === 'object' ? link.target?.id : link.target;
  const target = targetId ? nodes.find(n => n.id === targetId) : undefined;
  
  // Determine if this link connects to the selected node, with proper null checking
  const isSelected = Boolean(selectedNode && (
    (typeof link.source === 'object' && link.source?.id && nodes.find(n => n.id === link.source?.id)?.name === selectedNode) ||
    (typeof link.source !== 'object' && nodes.find(n => n.id === link.source)?.name === selectedNode) ||
    (typeof link.target === 'object' && link.target?.id && nodes.find(n => n.id === link.target?.id)?.name === selectedNode) ||
    (typeof link.target !== 'object' && nodes.find(n => n.id === link.target)?.name === selectedNode)
  ));
  
  // Calculate stroke color based on node type
  let strokeColor = "#9ca3af";
  if (target?.type === 'ens-domain') {
    strokeColor = target.isDotBox ? "#8b5cf6" : "#6366f1";
  }
  
  // Get x and y positions with null checking
  const sourceX = typeof link.source === 'object' ? link.source?.x ?? 0 : 0;
  const sourceY = typeof link.source === 'object' ? link.source?.y ?? 0 : 0;
  const targetX = typeof link.target === 'object' ? link.target?.x ?? 0 : 0;
  const targetY = typeof link.target === 'object' ? link.target?.y ?? 0 : 0;
  
  return (
    <line
      stroke={strokeColor}
      strokeOpacity={isSelected ? 1 : 0.7}
      strokeWidth={isSelected ? Math.sqrt(link.value) * 2 : Math.sqrt(link.value) * 1.5}
      x1={sourceX}
      y1={sourceY}
      x2={targetX}
      y2={targetY}
    />
  );
};

export default NetworkLink;
