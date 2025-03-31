
import React from 'react';
import { NetworkLink as NetworkLinkType, NetworkNode } from '../hooks/useIdNetworkData';

interface NetworkLinkProps {
  link: NetworkLinkType;
  nodes: NetworkNode[];
  selectedNode: string | null;
}

const NetworkLink: React.FC<NetworkLinkProps> = ({ link, nodes, selectedNode }) => {
  // Find the target node to determine color
  const target = nodes.find(n => n.id === (typeof link.target === 'object' ? link.target.id : link.target));
  
  // Determine if this link connects to the selected node
  const isSelected = selectedNode && (
    (typeof link.source === 'object' && link.source.id && link.source.name === selectedNode) ||
    (typeof link.source !== 'object' && nodes.find(n => n.id === link.source)?.name === selectedNode) ||
    (typeof link.target === 'object' && link.target.id && link.target.name === selectedNode) ||
    (typeof link.target !== 'object' && nodes.find(n => n.id === link.target)?.name === selectedNode)
  );
  
  // Calculate stroke color based on node type
  let strokeColor = "#9ca3af";
  if (target?.type === 'ens-domain') {
    strokeColor = target.isDotBox ? "#8b5cf6" : "#6366f1";
  }
  
  return (
    <line
      stroke={strokeColor}
      strokeOpacity={isSelected ? 1 : 0.7}
      strokeWidth={isSelected ? Math.sqrt(link.value) * 2 : Math.sqrt(link.value) * 1.5}
      x1={typeof link.source === 'object' ? link.source.x : 0}
      y1={typeof link.source === 'object' ? link.source.y : 0}
      x2={typeof link.target === 'object' ? link.target.x : 0}
      y2={typeof link.target === 'object' ? link.target.y : 0}
    />
  );
};

export default NetworkLink;
