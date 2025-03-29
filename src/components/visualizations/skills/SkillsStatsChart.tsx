
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { PassportSkill } from '@/lib/utils';

interface SkillsStatsChartProps {
  skills: PassportSkill[];
}

const SkillsStatsChart: React.FC<SkillsStatsChartProps> = ({ skills }) => {
  const statsRef = useRef<SVGSVGElement>(null);
  
  // Generate stats for the skills
  useEffect(() => {
    if (!statsRef.current || skills.length === 0) return;

    const width = 220;
    const height = 80;
    const margin = { top: 10, right: 10, bottom: 20, left: 40 };

    // Clear previous visualization
    d3.select(statsRef.current).selectAll("*").remove();

    const svg = d3.select(statsRef.current)
      .attr("width", width)
      .attr("height", height);

    // Calculate skill stats
    const verifiedCount = skills.filter(skill => skill.proof).length;
    const unverifiedCount = skills.length - verifiedCount;
    const data = [
      { category: "Verified", value: verifiedCount },
      { category: "Unverified", value: unverifiedCount }
    ];

    // Create scales
    const x = d3.scaleBand()
      .domain(data.map(d => d.category))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Add bars
    svg.selectAll(".bar")
      .data(data)
      .join("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.category) || 0)
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => y(0) - y(d.value))
        .attr("fill", (d, i) => i === 0 ? "#3b82f6" : "#9ca3af");

    // Add value labels
    svg.selectAll(".label")
      .data(data)
      .join("text")
        .attr("class", "label")
        .attr("x", d => (x(d.category) || 0) + x.bandwidth() / 2)
        .attr("y", d => y(d.value) - 5)
        .attr("text-anchor", "middle")
        .text(d => d.value)
        .attr("fill", "#374151")
        .attr("font-size", "10px");

    // Add axis
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("font-size", "8px");

    // Add title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top)
      .attr("text-anchor", "middle")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("fill", "#374151")
      .text("Skills Breakdown");

  }, [skills]);

  return <svg ref={statsRef} className="mx-auto"></svg>;
};

export default SkillsStatsChart;
