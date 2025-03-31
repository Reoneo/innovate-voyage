
import React from 'react';
import { animated, useSpring } from 'react-spring';

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

  const springs = useSpring({
    from: { strokeOpacity: 0, strokeWidth: 1 },
    to: {
      strokeOpacity: opacity,
      strokeWidth: highlighted ? 3 : 1,
    },
    config: { tension: 300, friction: 35 },
  });

  return (
    <animated.line
      x1={sourceX}
      y1={sourceY}
      x2={targetX}
      y2={targetY}
      stroke="#999"
      strokeOpacity={springs.strokeOpacity}
      strokeWidth={springs.strokeWidth}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    />
  );
};

export default NetworkLink;
