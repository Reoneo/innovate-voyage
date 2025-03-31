
import React from 'react';
import { NetworkLink as NetworkLinkType, NetworkNode } from '../hooks/useIdNetworkData';

interface NetworkLinkProps {
  link: NetworkLinkType;
  nodes: NetworkNode[];
  selectedNode: string | null;
}

const NetworkLink: React.FC<NetworkLinkProps> = ({ link, nodes, selectedNode }) => {
  // Find the target node to determine color, with proper null checking
  const targetId = typeof link.target === 'object' && link.target !== null ? link.target.id : link.target;
  const target = targetId ? nodes.find(n => n.id === targetId) : undefined;
  
  // Determine if this link connects to the selected node, with proper null checking
  const isSelected = Boolean(selectedNode) && (
    // Check if the source node matches the selected node name
    ((typeof link.source === 'object' && link.source !== null) ? 
      nodes.find(n => n.id === link.source?.id)?.name === selectedNode : 
      (link.source ? nodes.find(n => n.id === link.source)?.name === selectedNode : false)) ||
    
    // Check if the target node matches the selected node name
    ((typeof link.target === 'object' && link.target !== null) ? 
      nodes.find(n => n.id === link.target?.id)?.name === selectedNode : 
      (link.target ? nodes.find(n => n.id === link.target)?.name === selectedNode : false))
  );
  
  // Calculate stroke color based on node type
  let strokeColor = "#9ca3af";
  if (target?.type === 'ens-domain') {
    strokeColor = target.isDotBox ? "#8b5cf6" : "#6366f1";
  }
  
  // Get x and y positions with enhanced null checking
  const sourceX = typeof link.source === 'object' && link.source !== null ? (link.source.x ?? 0) : 0;
  const sourceY = typeof link.source === 'object' && link.source !== null ? (link.source.y ?? 0) : 0;
  const targetX = typeof link.target === 'object' && link.target !== null ? (link.target.x ?? 0) : 0;
  const targetY = typeof link.target === 'object' && link.target !== null ? (link.target.y ?? 0) : 0;
  
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
