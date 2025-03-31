
import * as d3 from 'd3';
import { createTooltip, getTooltipContent } from '../../utils/idNetworkUtils';

/**
 * Apply tooltips to the nodes in the network
 */
export const applyNodeTooltips = (node: d3.Selection<any, any, any, any>) => {
  const tooltip = createTooltip();
  
  node.on("mouseover", function(event, d: any) {
    tooltip.style("visibility", "visible")
      .html(() => getTooltipContent(d))
      .style("top", (event.pageY - 10) + "px")
      .style("left", (event.pageX + 10) + "px");
  })
  .on("mousemove", function(event) {
    tooltip.style("top", (event.pageY - 10) + "px")
      .style("left", (event.pageX + 10) + "px");
  })
  .on("mouseout", function() {
    tooltip.style("visibility", "hidden");
  });
  
  return tooltip;
};
