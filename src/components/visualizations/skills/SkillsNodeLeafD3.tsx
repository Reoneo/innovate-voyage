
import React, { useEffect, useRef, useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useSkillsD3 } from './d3/useSkillsD3';
import SkillNodeTooltip from './tooltips/SkillNodeTooltip';
import ConnectionTooltip from './tooltips/ConnectionTooltip';

interface SkillsNodeLeafD3Props {
  skills: Array<{ name: string; proof?: string; issued_by?: string }>;
  name: string;
}

const SkillsNodeLeafD3: React.FC<SkillsNodeLeafD3Props> = ({ skills, name }) => {
  const d3Container = useRef<SVGSVGElement>(null);
  const [skillTooltip, setSkillTooltip] = useState<{
    visible: boolean;
    data?: any;
    position: { x: number; y: number };
  }>({
    visible: false,
    position: { x: 0, y: 0 }
  });
  
  const [connectionTooltip, setConnectionTooltip] = useState<{
    visible: boolean;
    position: { x: number; y: number };
  }>({
    visible: false,
    position: { x: 0, y: 0 }
  });

  // Use the D3 hook for rendering - with proper cleanup
  useEffect(() => {
    // Make sure we have the skills data before rendering
    if (!skills || skills.length === 0 || !d3Container.current) return;

    // Call the D3 hook to set up the visualization
    const cleanup = useSkillsD3(d3Container, skills, name);
    
    // Set up event listeners for tooltips
    const svgElement = d3Container.current;

    const handleSkillNodeMouseOver = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      const nodeData = detail.node.data;
      
      if (detail.node.depth > 0) {
        setSkillTooltip({
          visible: true,
          data: nodeData,
          position: { x: detail.x, y: detail.y }
        });
      }
    };

    const handleSkillNodeMouseOut = () => {
      setSkillTooltip(prev => ({ ...prev, visible: false }));
    };

    const handleConnectionMouseOver = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      setConnectionTooltip({
        visible: true,
        position: { x: detail.x, y: detail.y }
      });
    };

    const handleConnectionMouseOut = () => {
      setConnectionTooltip(prev => ({ ...prev, visible: false }));
    };

    // Add event listeners
    svgElement.addEventListener('skillnodemouseover', handleSkillNodeMouseOver);
    svgElement.addEventListener('skillnodemouseout', handleSkillNodeMouseOut);
    svgElement.addEventListener('connectionmouseover', handleConnectionMouseOver);
    svgElement.addEventListener('connectionmouseout', handleConnectionMouseOut);

    // Return cleanup function that will run when component unmounts or when dependencies change
    return () => {
      // Remove event listeners
      svgElement.removeEventListener('skillnodemouseover', handleSkillNodeMouseOver);
      svgElement.removeEventListener('skillnodemouseout', handleSkillNodeMouseOut);
      svgElement.removeEventListener('connectionmouseover', handleConnectionMouseOver);
      svgElement.removeEventListener('connectionmouseout', handleConnectionMouseOut);
      
      // Call cleanup from useSkillsD3 hook if it exists
      if (cleanup) cleanup();
    };
  }, [skills, name]); // Only re-run if skills or name changes

  return (
    <div className="w-full h-full">
      <svg 
        className="w-full h-full" 
        ref={d3Container}
        width="100%"
        height="100%"
        viewBox="0 0 400 300"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Only render tooltips when they're visible to avoid React/D3 conflicts */}
        {skillTooltip.visible && skillTooltip.data && (
          <foreignObject
            x={skillTooltip.position.x}
            y={skillTooltip.position.y}
            width="200"
            height="80"
            style={{ overflow: 'visible' }}
          >
            <SkillNodeTooltip 
              data={skillTooltip.data} 
              position={skillTooltip.position} 
            />
          </foreignObject>
        )}
        
        {connectionTooltip.visible && (
          <foreignObject
            x={connectionTooltip.position.x}
            y={connectionTooltip.position.y}
            width="200"
            height="80"
            style={{ overflow: 'visible' }}
          >
            <ConnectionTooltip 
              position={connectionTooltip.position} 
            />
          </foreignObject>
        )}
      </svg>
    </div>
  );
};

export default SkillsNodeLeafD3;
