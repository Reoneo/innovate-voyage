
import * as d3 from 'd3';

type SkillsData = {
  name: string;
  children?: SkillsData[];
  value?: number;
  proof?: string;
  issued_by?: string;
};

// This should NOT be a custom hook as it's being used in a useEffect
// Convert it to a regular function that accepts the DOM element and data
export function createSkillsVisualization(
  svgElement: SVGSVGElement,
  skills: Array<{ name: string; proof?: string; issued_by?: string }>,
  centerName: string
) {
  // Store a cleanup function to return
  let cleanup: (() => void) | null = null;
  
  if (!svgElement || !skills || skills.length === 0) return () => {};
  
  const svg = d3.select(svgElement);
  
  // Clear any existing visualization first to avoid conflicts
  svg.selectAll("*").remove();
  
  const width = 400;
  const height = 300;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Create data hierarchy
  const data: SkillsData = {
    name: centerName || "Skills",
    children: skills.map(skill => ({
      name: skill.name,
      value: 1,
      proof: skill.proof,
      issued_by: skill.issued_by
    }))
  };
  
  const hierarchyData = d3.hierarchy(data)
    .sum(d => (d as any).value || 1);
  
  // Create pack layout
  const pack = d3.pack()
    .size([width - 50, height - 50])
    .padding(10);
  
  const root = pack(hierarchyData);
  
  // Define colors
  const colors = d3.scaleOrdinal(d3.schemeTableau10);
  
  // Draw center node
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
  
  // Generate sample project metadata for nodes
  const generateProjectMetadata = (skillName: string, index: number) => {
    // Not all skills will have project metadata - add some randomness
    if (Math.random() > 0.7) return undefined;
    
    const projects = ["DAO", "Protocol", "DApp", "Smart Contract", "Token"];
    const roles = ["Developer", "Contributor", "Auditor", "Creator", "Researcher"];
    const timeframes = ["2022-Present", "2021-2022", "2023-Present", "2020-2021", "2022-2023"];
    const statuses = ["Active", "Completed", "In Progress", "Maintenance", "Planning"];
    
    return {
      project: `${skillName} ${projects[index % projects.length]}`,
      description: `A project related to ${skillName}`,
      role: roles[index % roles.length],
      timeframe: timeframes[index % timeframes.length],
      status: statuses[index % statuses.length],
      connections: Math.floor(Math.random() * 10) + 1
    };
  };
  
  // Store created selections for proper cleanup
  const allSelections: d3.Selection<any, any, any, any>[] = [];
  
  // Draw skill nodes
  const nodes = svg.append("g")
    .selectAll("g")
    .data(root.descendants().slice(1))
    .enter()
    .append("g")
    .attr("transform", d => `translate(
      ${centerX + (d.x - width/2) * 0.8}, 
      ${centerY + (d.y - height/2) * 0.8}
    )`);
  
  allSelections.push(nodes);
  
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
      
      // Dispatch custom event for tooltip with enhanced data
      const currentTarget = event.currentTarget;
      const rect = currentTarget.getBoundingClientRect();
      
      // Enhance node data with projectMetadata if needed
      const enhancedNodeData = {
        ...nodeData,
        data: {
          ...nodeData.data,
          verified: !!nodeData.data.proof,
          projectMetadata: generateProjectMetadata(nodeData.data.name, nodeData.depth)
        }
      };
      
      const detail = {
        node: enhancedNodeData,
        x: event.pageX || rect.x + rect.width/2,
        y: event.pageY || rect.y
      };
      
      try {
        const customEvent = new CustomEvent("skillnodemouseover", { detail });
        svgElement.dispatchEvent(customEvent);
      } catch (e) {
        console.error("Error dispatching skillnodemouseover event:", e);
      }
    })
    .on("mouseout", function(event, nodeData) {
      d3.select(this)
        .transition()
        .duration(300)
        .attr("opacity", 0.8)
        .attr("r", nodeData.r);
      
      try {
        const customEvent = new CustomEvent("skillnodemouseout");
        svgElement.dispatchEvent(customEvent);
      } catch (e) {
        console.error("Error dispatching skillnodemouseout event:", e);
      }
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
  
  // Add connections between center and nodes
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
  
  allSelections.push(connections);
  
  connections
    .on("mouseover", function(event) {
      d3.select(this)
        .transition()
        .duration(300)
        .attr("opacity", 1)
        .attr("stroke-width", d => d.data.proof ? 3 : 2);
      
      // Dispatch custom event for tooltip
      try {
        const rect = event.target.getBoundingClientRect();
        const detail = {
          x: event.pageX || rect.x + rect.width/2,
          y: event.pageY || rect.y
        };
        const customEvent = new CustomEvent("connectionmouseover", { detail });
        svgElement.dispatchEvent(customEvent);
      } catch (e) {
        console.error("Error dispatching connectionmouseover event:", e);
      }
    })
    .on("mouseout", function(event, nodeData) {
      d3.select(this)
        .transition()
        .duration(300)
        .attr("opacity", 0.6)
        .attr("stroke-width", nodeData.data.proof ? 2 : 1);
      
      try {
        const customEvent = new CustomEvent("connectionmouseout");
        svgElement.dispatchEvent(customEvent);
      } catch (e) {
        console.error("Error dispatching connectionmouseout event:", e);
      }
    });
  
  // Set up proper cleanup function for D3
  cleanup = () => {
    if (svgElement) {
      // First, remove event handlers to prevent memory leaks
      allSelections.forEach(selection => {
        selection.on("mouseover", null).on("mouseout", null);
      });
      
      // Then remove all elements from the SVG
      svg.selectAll("*").remove();
    }
  };
  
  // Return cleanup to be used by the component
  return cleanup;
}
