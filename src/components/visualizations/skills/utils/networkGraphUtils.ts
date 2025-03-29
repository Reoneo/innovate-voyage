
import * as d3 from 'd3';

/**
 * Creates a drag behavior for d3 force simulation
 */
export function createDragBehavior(simulation: d3.ForceSimulation<any, any>) {
  function dragstarted(event: any) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }
  
  function dragged(event: any) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }
  
  function dragended(event: any) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
  
  return d3.drag()
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended);
}

/**
 * Creates a tooltip element and attaches it to the body
 */
export function createTooltip() {
  return d3.select("body")
    .append("div")
    .attr("class", "network-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "rgba(0,0,0,0.8)")
    .style("color", "white")
    .style("padding", "5px 10px")
    .style("border-radius", "4px")
    .style("font-size", "12px")
    .style("pointer-events", "none");
}
