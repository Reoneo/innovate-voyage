
import React from 'react';
import { motion } from 'framer-motion';

interface NetworkLinkProps {
  link: {
    source: { id: string; x: number; y: number } | string;
    target: { id: string; x: number; y: number } | string;
    value: number;
  };
  animated: boolean;
  isHighlighted: boolean;
  opacity?: number;
}

const NetworkLink: React.FC<NetworkLinkProps> = ({ link, animated, isHighlighted, opacity = 0.5 }) => {
  // Handle both string and object source/target formats
  const sourceId = typeof link.source === 'string' ? link.source : link.source?.id;
  const targetId = typeof link.target === 'string' ? link.target : link.target?.id;
  
  // Skip rendering if the link is not valid
  if (!sourceId || !targetId) {
    return null;
  }
  
  // Handle both string and object source/target formats for coordinates
  const x1 = typeof link.source === 'string' ? 0 : link.source?.x || 0;
  const y1 = typeof link.source === 'string' ? 0 : link.source?.y || 0;
  const x2 = typeof link.target === 'string' ? 0 : link.target?.x || 0;
  const y2 = typeof link.target === 'string' ? 0 : link.target?.y || 0;
  
  // If using string references, don't render the link visually
  if (typeof link.source === 'string' || typeof link.target === 'string') {
    return null;
  }
  
  const strokeWidth = Math.sqrt(link.value) || 1;
  
  return (
    <motion.line
      initial={animated ? { opacity: 0, pathLength: 0 } : { opacity: opacity }}
      animate={animated ? {
        opacity: isHighlighted ? 0.8 : opacity,
        pathLength: 1,
        strokeWidth: isHighlighted ? strokeWidth + 1 : strokeWidth
      } : {
        opacity: isHighlighted ? 0.8 : opacity,
        strokeWidth: isHighlighted ? strokeWidth + 1 : strokeWidth
      }}
      transition={{ duration: 0.8 }}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={isHighlighted ? "#3b82f6" : "#64748b"}
      strokeWidth={strokeWidth}
      strokeOpacity={isHighlighted ? 0.8 : 0.5}
    />
  );
};

export default NetworkLink;
