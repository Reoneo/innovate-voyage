
import * as d3 from 'd3';
import { dispatchCustomEvent } from './skillsVisualizationUtils';

/**
 * Create and render connections between center and nodes
 */
export function renderConnections(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  root: d3.HierarchyNode<any>,
  centerX: number,
  centerY: number,
  width: number, 
  height: number,
  svgElement: SVGSVGElement
) {
  const connections = svg.insert("g", ":first-child")
    .selectAll("line")
    .data(root.descendants().slice(1))
    .enter()
    .append("line")
    .attr("x1", centerX)
    .attr("y1", centerY)
    .attr("x2", d => centerX + (d.x - width/2) * 0.8)
    .attr("y2", d => centerY + (d.y - height/2) * 0.8)
    .attr("stroke", d => d.data.proof ? "#4f46e5" : "#9ca3af")
    .attr("stroke-width", d => d.data.proof ? 2 : 1)
    .attr("stroke-dasharray", d => d.data.proof ? "none" : "3,3")
    .attr("opacity", 0.6);
  
  connections
    .on("mouseover", function(event) {
      d3.select(this)
        .transition()
        .duration(300)
        .attr("opacity", 1)
        .attr("stroke-width", d => d.data.proof ? 3 : 2);
      
      // Dispatch custom event for tooltip
      const rect = event.target.getBoundingClientRect();
      const detail = {
        x: event.pageX || rect.x + rect.width/2,
        y: event.pageY || rect.y
      };
      
      dispatchCustomEvent("connectionmouseover", detail, svgElement);
    })
    .on("mouseout", function(event, nodeData) {
      d3.select(this)
        .transition()
        .duration(300)
        .attr("opacity", 0.6)
        .attr("stroke-width", nodeData.data.proof ? 2 : 1);
      
      dispatchCustomEvent("connectionmouseout", {}, svgElement);
    });
    
  return connections;
}
