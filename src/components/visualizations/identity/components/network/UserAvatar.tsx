
import * as d3 from 'd3';

/**
 * Setup user avatar pattern for the central node
 */
export const setupUserAvatar = (svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, avatarUrl?: string) => {
  if (avatarUrl) {
    const defs = svg.append("defs");
    const pattern = defs.append("pattern")
      .attr("id", "user-avatar")
      .attr("width", 1)
      .attr("height", 1)
      .attr("patternUnits", "objectBoundingBox");
      
    pattern.append("image")
      .attr("xlink:href", avatarUrl)
      .attr("width", 60)
      .attr("height", 60)
      .attr("preserveAspectRatio", "xMidYMid slice");
  }
};
