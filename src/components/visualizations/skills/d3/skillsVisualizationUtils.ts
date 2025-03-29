
import * as d3 from 'd3';

/**
 * Generate sample project metadata for nodes
 */
export function generateProjectMetadata(skillName: string, index: number) {
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
}

/**
 * Create and configure the D3 pack layout for skills visualization
 */
export function createPackLayout(width: number, height: number, hierarchyData: d3.HierarchyNode<any>) {
  const pack = d3.pack()
    .size([width - 50, height - 50])
    .padding(10);
  
  return pack(hierarchyData);
}

/**
 * Prepare skills data for hierarchy
 */
export function prepareSkillsData(skills: Array<{ name: string; proof?: string; issued_by?: string }>, centerName: string) {
  const data = {
    name: centerName || "Skills",
    children: skills.map(skill => ({
      name: skill.name,
      value: 1,
      proof: skill.proof,
      issued_by: skill.issued_by
    }))
  };
  
  return d3.hierarchy(data)
    .sum(d => (d as any).value || 1);
}

/**
 * Create an enhanced node data object for tooltips
 */
export function createEnhancedNodeData(nodeData: any) {
  return {
    ...nodeData,
    data: {
      ...nodeData.data,
      verified: !!nodeData.data.proof,
      projectMetadata: generateProjectMetadata(nodeData.data.name, nodeData.depth)
    }
  };
}

/**
 * Dispatch a custom event for tooltips
 */
export function dispatchCustomEvent(
  eventName: string, 
  detail: any, 
  svgElement: SVGSVGElement
) {
  try {
    const customEvent = new CustomEvent(eventName, { detail });
    svgElement.dispatchEvent(customEvent);
  } catch (e) {
    console.error(`Error dispatching ${eventName} event:`, e);
  }
}
