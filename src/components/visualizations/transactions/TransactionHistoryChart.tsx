
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Transaction {
  timeStamp: string;
  from: string;
  to: string;
  value: string;
  hash: string;
}

interface TransactionHistoryChartProps {
  transactions: Transaction[];
  address: string;
  showLabels?: boolean;
}

const TransactionHistoryChart: React.FC<TransactionHistoryChartProps> = ({ 
  transactions, 
  address,
  showLabels = false
}) => {
  const chartRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!chartRef.current || !transactions || transactions.length === 0) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll("*").remove();

    // Format the data for the chart
    const data = transactions.map(tx => {
      const date = new Date(parseInt(tx.timeStamp) * 1000);
      const isSent = tx.from.toLowerCase() === address.toLowerCase();
      const value = parseFloat(tx.value) / 1e18; // Convert from wei to ETH
      
      return {
        date,
        value,
        type: isSent ? 'sent' : 'received',
        hash: tx.hash
      };
    }).sort((a, b) => a.date.getTime() - b.date.getTime());

    // Set up dimensions
    const width = chartRef.current.clientWidth || 400;
    const height = chartRef.current.clientHeight || 200;
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(chartRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) as number * 1.1])
      .nice()
      .range([innerHeight, 0]);

    // Create the main group element
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add X and Y axes
    const xAxis = d3.axisBottom(xScale)
      .ticks(5)
      .tickFormat(d => {
        const date = d as Date;
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().substr(2, 2)}`;
      });

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('font-size', '10px')
      .attr('transform', 'rotate(-45)')
      .attr('text-anchor', 'end')
      .attr('dx', '-0.8em')
      .attr('dy', '0.15em');

    const yAxis = d3.axisLeft(yScale)
      .ticks(5)
      .tickFormat(d => `${d} ETH`);

    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis)
      .selectAll('text')
      .attr('font-size', '10px');

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .attr('opacity', 0.1)
      .call(d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(-innerWidth)
        .tickFormat(() => '')
      );

    // Add scatter plot points
    g.selectAll('.transaction-point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'transaction-point')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.value))
      .attr('r', 5)
      .attr('fill', d => d.type === 'sent' ? '#ef4444' : '#10b981')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('r', 7)
          .attr('stroke-width', 2);
          
        // Show tooltip
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .attr('transform', `translate(${xScale(d.date) + margin.left + 10},${yScale(d.value) + margin.top - 20})`);
          
        tooltip.append('rect')
          .attr('width', 130)
          .attr('height', 50)
          .attr('rx', 5)
          .attr('fill', 'rgba(0,0,0,0.8)');
          
        tooltip.append('text')
          .attr('x', 5)
          .attr('y', 15)
          .attr('fill', 'white')
          .attr('font-size', '10px')
          .text(`${d.value.toFixed(4)} ETH ${d.type}`);
          
        tooltip.append('text')
          .attr('x', 5)
          .attr('y', 35)
          .attr('fill', 'white')
          .attr('font-size', '10px')
          .text(`${d.date.toLocaleDateString()}`);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('r', 5)
          .attr('stroke-width', 1);
          
        svg.selectAll('.tooltip').remove();
      });

    // Add a line chart connecting the points
    const line = d3.line<{date: Date, value: number}>()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 1.5)
      .attr('stroke-opacity', 0.6)
      .attr('d', line);

    // Add transaction type labels if requested
    if (showLabels) {
      g.selectAll('.transaction-label')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'transaction-label')
        .attr('x', d => xScale(d.date))
        .attr('y', d => yScale(d.value) - 10)
        .attr('text-anchor', 'middle')
        .attr('font-size', '8px')
        .attr('fill', d => d.type === 'sent' ? '#ef4444' : '#10b981')
        .text(d => d.type === 'sent' ? 'S' : 'R');
    }

    // Add chart title
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', -5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .text('ETH Transaction History');

  }, [transactions, address, showLabels]);

  return (
    <div className="w-full h-full">
      <svg 
        ref={chartRef} 
        className="w-full h-full" 
        width="100%" 
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
};

export default TransactionHistoryChart;
