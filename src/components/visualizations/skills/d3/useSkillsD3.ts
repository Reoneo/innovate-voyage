
import * as d3 from 'd3';
import { prepareSkillsData, createPackLayout } from './skillsVisualizationUtils';
import { renderSkillNodes, renderCenterNode } from './skillsVisualizationNodes';
import { renderConnections } from './skillsVisualizationConnections';

type SkillsData = {
  name: string;
  children?: SkillsData[];
  value?: number;
  proof?: string;
  issued_by?: string;
};

/**
 * Creates a skills visualization with D3
 * This is a regular function (not a hook) as it's used in useEffect
 */
export function createSkillsVisualization(
  svgElement: SVGSVGElement,
  skills: Array<{ name: string; proof?: string; issued_by?: string }>,
  centerName: string
) {
  // Return early if missing required elements
  if (!svgElement || !skills || skills.length === 0) return () => {};
  
  // Initialize D3 selection
  const svg = d3.select(svgElement);
  
  // Clear any existing visualization first to avoid conflicts
  svg.selectAll("*").remove();
  
  // Set up dimensions
  const width = 400;
  const height = 300;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Create data hierarchy and pack layout
  const hierarchyData = prepareSkillsData(skills, centerName);
  const root = createPackLayout(width, height, hierarchyData);
  
  // Define colors
  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  
  // Store created selections for proper cleanup
  const selections: d3.Selection<any, any, any, any>[] = [];
  
  // Create center node
  const center = renderCenterNode(svg, centerX, centerY, centerName);
  selections.push(center);
  
  // Create skill nodes
  const nodes = renderSkillNodes(svg, root, centerX, centerY, colors, svgElement);
  selections.push(nodes);
  
  // Create connections between center and nodes
  const connections = renderConnections(svg, root, centerX, centerY, width, height, svgElement);
  selections.push(connections);
  
  // Set up proper cleanup function for D3
  const cleanup = () => {
    if (svgElement) {
      // First, remove event handlers to prevent memory leaks
      selections.forEach(selection => {
        selection.on("mouseover", null).on("mouseout", null);
      });
      
      // Then remove all elements from the SVG
      svg.selectAll("*").remove();
    }
  };
  
  // Return cleanup to be used by the component
  return cleanup;
}
