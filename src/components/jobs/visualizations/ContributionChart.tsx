
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const ContributionChart: React.FC = () => {
  const projectsRef = useRef<SVGSVGElement>(null);

  // Generate skill distribution dashboard
  useEffect(() => {
    if (!projectsRef.current) return;

    const width = 240;
    const height = 140;
    const margin = { top: 10, right: 10, bottom: 20, left: 40 };

    // Clear previous visualization
    d3.select(projectsRef.current).selectAll("*").remove();

    const svg = d3.select(projectsRef.current)
      .attr("width", width)
      .attr("height", height);

    // Generate contribution data
    const contributions = [
      { category: "Code", value: Math.floor(Math.random() * 50) + 20 },
      { category: "Review", value: Math.floor(Math.random() * 20) + 5 },
      { category: "Docs", value: Math.floor(Math.random() * 15) + 3 }
    ];

    // Create scales
    const x = d3.scaleBand()
      .domain(contributions.map(d => d.category))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3.scaleLinear()
      .domain([0, d3.max(contributions, d => d.value) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Add grid lines
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3.axisBottom(x)
          .tickSize(-(height - margin.top - margin.bottom))
          .tickFormat(() => "")
      )
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line")
        .attr("stroke", "#e5e7eb")
        .attr("stroke-opacity", 0.5)
      );

    // Add bars with gradient
    const bars = svg.selectAll(".bar")
      .data(contributions)
      .join("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.category) || 0)
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => y(0) - y(d.value))
        .attr("rx", 2)
        .attr("fill", (d, i) => {
          const colors = ["#3b82f6", "#8b5cf6", "#ec4899"];
          return colors[i % colors.length];
        });

    // Add hover effect
    bars.on("mouseover", function() {
      d3.select(this).attr("opacity", 0.8);
    })
    .on("mouseout", function() {
      d3.select(this).attr("opacity", 1);
    });

    // Add value labels
    svg.selectAll(".label")
      .data(contributions)
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
        .attr("font-size", "9px");

    // Add title
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", margin.top)
      .attr("text-anchor", "middle")
      .attr("font-size", "11px")
      .attr("font-weight", "bold")
      .attr("fill", "#374151")
      .text("Contribution History");

  }, []);

  return <svg ref={projectsRef} className="mx-auto"></svg>;
};

export default ContributionChart;
