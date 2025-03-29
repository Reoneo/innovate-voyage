
import * as d3 from 'd3';
import { createEnhancedNodeData, dispatchCustomEvent, generateProjectMetadata } from './skillsVisualizationUtils';

/**
 * Create and render nodes for the skills visualization
 */
export function renderSkillNodes(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  root: d3.HierarchyNode<any>,
  centerX: number,
  centerY: number,
  colors: d3.ScaleOrdinal<string, string, never>,
  svgElement: SVGSVGElement
) {
  // Create nodes
  const nodes = svg.append("g")
    .selectAll("g")
    .data(root.descendants().slice(1))
    .enter()
    .append("g")
    .attr("transform", d => `translate(
      ${centerX + (d.x - root.x) * 0.8}, 
      ${centerY + (d.y - root.y) * 0.8}
    )`);
  
  // Add circles for each node
  nodes.append("circle")
    .attr("r", d => d.r)
    .attr("fill", (d, i) => d.data.proof ? "#4f46e5" : colors(i.toString()))
    .attr("stroke", d => d.data.proof ? "#1e1b4b" : "#6b7280")
    .attr("stroke-width", 1.5)
    .attr("stroke-dasharray", d => d.data.proof ? "none" : "2,2")
    .attr("opacity", 0.8)
    .on("mouseover", function(event, nodeData) {
      d3.select(this)
        .transition()
        .duration(300)
        .attr("opacity", 1)
        .attr("r", nodeData.r * 1.1);
      
      // Get position for tooltip
      const currentTarget = event.currentTarget;
      const rect = currentTarget.getBoundingClientRect();
      
      // Create enhanced node data for tooltip
      const enhancedNodeData = createEnhancedNodeData(nodeData);
      
      const detail = {
        node: enhancedNodeData,
        x: event.pageX || rect.x + rect.width/2,
        y: event.pageY || rect.y
      };
      
      dispatchCustomEvent("skillnodemouseover", detail, svgElement);
    })
    .on("mouseout", function(event, nodeData) {
      d3.select(this)
        .transition()
        .duration(300)
        .attr("opacity", 0.8)
        .attr("r", nodeData.r);
      
      dispatchCustomEvent("skillnodemouseout", {}, svgElement);
    });
  
  // Add text to each node
  nodes.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.3em")
    .attr("font-size", "10px")
    .attr("fill", "#fff")
    .text(d => {
      const name = d.data.name as string;
      return name.length > 10 ? name.substring(0, 8) + "..." : name;
    });
    
  return nodes;
}

/**
 * Create center node for the skills visualization
 */
export function renderCenterNode(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  centerX: number,
  centerY: number,
  centerName: string
) {
  const center = svg.append("g")
    .attr("transform", `translate(${centerX}, ${centerY})`);
  
  center.append("circle")
    .attr("r", 40)
    .attr("fill", "#4f46e5")
    .attr("stroke", "#1e1b4b")
    .attr("stroke-width", 2);
  
  center.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.3em")
    .attr("font-size", "12px")
    .attr("fill", "white")
    .text(centerName);
    
  return center;
}
