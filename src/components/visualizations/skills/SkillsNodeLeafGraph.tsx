
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { PassportSkill } from '@/lib/utils';

interface SkillsNodeLeafGraphProps {
  skills: PassportSkill[];
  name: string;
}

const SkillsNodeLeafGraph: React.FC<SkillsNodeLeafGraphProps> = ({ skills, name }) => {
  const graphRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!graphRef.current || skills.length === 0) return;

    // Clear any existing visualization
    d3.select(graphRef.current).selectAll("*").remove();

    const width = 240;
    const height = 240;
    const svg = d3.select(graphRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("style", "max-width: 100%; height: auto;");

    // Prepare data for the pack layout
    const categories = [
      { id: "root", parent: "", name: name, value: 0 },
      { id: "development", parent: "root", name: "Development", value: 0 },
      { id: "community", parent: "root", name: "Community", value: 0 },
      { id: "defi", parent: "root", name: "DeFi", value: 0 },
      { id: "creative", parent: "root", name: "Creative", value: 0 },
      { id: "security", parent: "root", name: "Security", value: 0 },
    ];

    // Categorize skills (simplified categorization)
    const devKeywords = ["solidity", "smart contract", "blockchain", "protocol", "development", "architecture"];
    const communityKeywords = ["community", "management", "content", "marketing", "social"];
    const defiKeywords = ["defi", "finance", "token", "trading", "liquidity", "yield"];
    const creativeKeywords = ["design", "nft", "art", "metaverse", "creative"];
    const securityKeywords = ["security", "audit", "hacking", "privacy", "cryptography"];

    // Assign skills to categories
    skills.forEach((skill, index) => {
      const skillName = skill.name.toLowerCase();
      let parentId = "root"; // Default parent
      
      if (devKeywords.some(keyword => skillName.includes(keyword))) {
        parentId = "development";
      } else if (communityKeywords.some(keyword => skillName.includes(keyword))) {
        parentId = "community";
      } else if (defiKeywords.some(keyword => skillName.includes(keyword))) {
        parentId = "defi";
      } else if (creativeKeywords.some(keyword => skillName.includes(keyword))) {
        parentId = "creative";
      } else if (securityKeywords.some(keyword => skillName.includes(keyword))) {
        parentId = "security";
      }
      
      categories.push({
        id: `skill-${index}`,
        parent: parentId,
        name: skill.name,
        value: skill.proof ? 30 : 20 // Verified skills are larger
      });
    });

    // Count skills in each category and set value for categories with no skills to 0
    const categoryCount: Record<string, number> = {
      development: 0,
      community: 0,
      defi: 0,
      creative: 0,
      security: 0
    };
    
    categories.forEach(item => {
      if (Object.keys(categoryCount).includes(item.parent)) {
        categoryCount[item.parent] += 1;
      }
    });

    // Filter out empty categories
    const filteredCategories = categories.filter(cat => {
      if (Object.keys(categoryCount).includes(cat.id)) {
        return categoryCount[cat.id] > 0;
      }
      return true;
    });

    // Create hierarchy
    const stratify = d3.stratify()
      .id((d: any) => d.id)
      .parentId((d: any) => d.parent);
    
    const root = stratify(filteredCategories)
      .sum((d: any) => d.value)
      .sort((a, b) => b.value! - a.value!);

    // Create pack layout
    const pack = d3.pack()
      .size([width - 10, height - 10])
      .padding(3);
    
    pack(root);

    // Draw circles for each node
    const node = svg.selectAll(".node")
      .data(root.descendants())
      .join("g")
        .attr("class", "node")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    // Add circles
    node.append("circle")
      .attr("r", d => d.r)
      .attr("fill", d => {
        if (d.depth === 0) return "#f3f4f6"; // Root
        if (d.depth === 1) return "#3b82f6"; // Categories
        // Skills - different colors for verified vs unverified
        const skillIndex = d.data.id.replace("skill-", "");
        const isVerified = skillIndex !== "root" && skills[parseInt(skillIndex)]?.proof;
        return isVerified ? "#8b5cf6" : "#6366f1";
      })
      .attr("opacity", d => d.depth === 0 ? 0.3 : d.depth === 1 ? 0.7 : 0.9)
      .attr("stroke", d => d.depth === 0 ? "none" : "#fff")
      .attr("stroke-width", d => d.depth === 0 ? 0 : 1);

    // Add text labels
    node.append("text")
      .attr("dy", d => d.depth === 0 ? 0 : d.depth === 1 ? "0.3em" : "0.3em")
      .attr("text-anchor", "middle")
      .attr("font-size", d => {
        if (d.depth === 0) return "12px";
        if (d.depth === 1) return "10px";
        return "8px";
      })
      .attr("fill", d => d.depth === 0 ? "#374151" : "#fff")
      .text(d => {
        if (d.depth === 0) return d.data.name;
        if (d.depth === 1) return d.data.name;
        // For skills, show abbreviated name if too long
        const name = d.data.name;
        return name.length > 10 ? name.substring(0, 9) + "..." : name;
      })
      .attr("opacity", d => {
        if (d.depth === 0) return 1;
        if (d.depth === 1) return 1;
        return d.r > 10 ? 1 : 0; // Only show text for larger nodes
      });

  }, [skills, name]);

  return <svg ref={graphRef} className="w-full h-full"></svg>;
};

export default SkillsNodeLeafGraph;
