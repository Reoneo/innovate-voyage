
import * as d3 from 'd3';

/**
 * Apply tooltips to network nodes
 */
export const applyNodeTooltips = (node: d3.Selection<any, any, any, any>) => {
  const tooltip = d3.select("body").append("div")
    .attr("class", "network-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "rgba(23, 23, 23, 0.9)")
    .style("color", "white")
    .style("padding", "8px 12px")
    .style("border-radius", "6px")
    .style("font-size", "14px")
    .style("pointer-events", "none")
    .style("box-shadow", "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)")
    .style("z-index", "100")
    .style("max-width", "220px");
  
  node.on("mouseenter", function(event, d) {
    // Different tooltip content based on node type
    let content = "";
    
    if (d.type === "user") {
      content = `<div><strong>${d.name}</strong><br />Main profile</div>`;
    } else if (d.type === "ens-domain") {
      content = `<div>
        <strong>${d.name}</strong><br />
        ENS Domain${d.isDotBox ? ' (.box)' : ' (.eth)'}
      </div>`;
    } else if (d.type === "identity-nft") {
      content = `<div>
        <strong>${d.name}</strong><br />
        Identity NFT
      </div>`;
    } else if (d.type === "platform") {
      content = `<div>
        <strong>${d.name}</strong><br />
        Web3 Platform
      </div>`;
    }
    
    tooltip.html(content)
      .style("visibility", "visible");
  })
  .on("mousemove", function(event) {
    // Position tooltip near mouse
    tooltip
      .style("top", (event.pageY - 10) + "px")
      .style("left", (event.pageX + 15) + "px");
  })
  .on("mouseleave", function() {
    tooltip.style("visibility", "hidden");
  });
  
  return tooltip;
};
