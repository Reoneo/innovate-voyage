
import React, { useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, Award, Shield, Globe, Check, Code, Box, FileText } from 'lucide-react';
import { HoverCardContent } from '@/components/ui/hover-card';
import { BlockchainPassport, PassportSkill } from '@/lib/utils';
import * as d3 from 'd3';

interface UserCardTooltipProps {
  passport: BlockchainPassport & {
    score: number;
    category: string;
    colorClass: string;
  };
}

const UserCardTooltip: React.FC<UserCardTooltipProps> = ({ passport }) => {
  const networkRef = useRef<SVGSVGElement>(null);
  const projectsRef = useRef<SVGSVGElement>(null);

  // Generate project network
  useEffect(() => {
    if (!networkRef.current) return;

    const width = 240;
    const height = 180;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };

    // Clear previous visualization
    d3.select(networkRef.current).selectAll("*").remove();

    const svg = d3.select(networkRef.current)
      .attr("width", width)
      .attr("height", height);

    // Generate mock project data based on user skills
    const projects = passport.skills?.slice(0, 5).map((skill, idx) => ({
      id: `project-${idx}`,
      name: `${skill.name} ${["Project", "Contribution", "Repo", "Initiative", "Protocol"][idx % 5]}`,
      type: ["GitHub", "Protocol", "DAO", "App", "NFT"][idx % 5],
      strength: Math.random() * 100
    })) || [];

    // Create nodes for network graph
    const nodes = [
      { id: "user", name: passport.name, type: "user", img: passport.avatar_url },
      ...projects
    ];

    // Create links between user and projects
    const links = projects.map(project => ({
      source: "user",
      target: project.id,
      value: project.strength / 20
    }));

    // Create simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(60))
      .force("charge", d3.forceManyBody().strength(-100))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(25));

    // Create a group for all elements
    const g = svg.append("g");

    // Add zoom behavior
    svg.call(d3.zoom()
      .extent([[0, 0], [width, height]])
      .scaleExtent([0.5, 2])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      }) as any);

    // Add links
    const link = g.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
        .attr("stroke-width", (d: any) => Math.sqrt(d.value) * 2);

    // Create node groups
    const node = g.append("g")
      .selectAll(".node")
      .data(nodes)
      .join("g")
        .attr("class", "node")
        .call(drag(simulation) as any);

    // Add node circles with different styling based on type
    node.append("circle")
      .attr("r", (d: any) => d.type === "user" ? 22 : 15)
      .attr("fill", (d: any) => {
        if (d.type === "user") {
          return "url(#user-avatar)";
        }
        return ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f97316"][nodes.indexOf(d) % 5];
      })
      .attr("stroke", (d: any) => d.type === "user" ? getScoreColorCode(passport.score) : "#fff")
      .attr("stroke-width", (d: any) => d.type === "user" ? 3 : 1);

    // Define avatar pattern for the user node
    if (passport.avatar_url) {
      const defs = svg.append("defs");
      const avatarPattern = defs.append("pattern")
        .attr("id", "user-avatar")
        .attr("width", 1)
        .attr("height", 1)
        .attr("patternUnits", "objectBoundingBox");

      avatarPattern.append("image")
        .attr("xlink:href", passport.avatar_url)
        .attr("width", 44)
        .attr("height", 44)
        .attr("preserveAspectRatio", "xMidYMid slice");
    }

    // Add icons for project nodes
    node.filter((d: any) => d.type !== "user")
      .append("text")
      .attr("y", 1)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .text((d: any) => getProjectIcon(d.type));

    // Add labels
    node.append("text")
      .attr("dy", (d: any) => d.type === "user" ? 35 : 25)
      .attr("text-anchor", "middle")
      .attr("fill", "#374151")
      .attr("font-size", "9px")
      .attr("font-weight", (d: any) => d.type === "user" ? "bold" : "normal")
      .text((d: any) => d.name.length > 10 ? d.name.substring(0, 10) + "..." : d.name);

    // Add CVB score on top of user avatar
    node.filter((d: any) => d.type === "user")
      .append("text")
      .attr("dy", -35)
      .attr("text-anchor", "middle")
      .attr("fill", getScoreColorCode(passport.score))
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .text(`CVB ${passport.score}`);

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    // Function to handle drag
    function drag(simulation: any) {
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

    // Helper function to get icon for project type
    function getProjectIcon(type: string): string {
      switch (type) {
        case "GitHub": return "G";
        case "Protocol": return "P";
        case "DAO": return "D";
        case "App": return "A";
        case "NFT": return "N";
        default: return "•";
      }
    }
  }, [passport]);

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

  }, [passport]);

  // Helper function to get color code from score
  const getScoreColorCode = (score: number): string => {
    if (score >= 90) return "#8b5cf6"; // purple
    if (score >= 75) return "#6366f1"; // indigo
    if (score >= 60) return "#3b82f6"; // blue
    if (score >= 45) return "#10b981"; // emerald
    if (score >= 30) return "#f59e0b"; // amber
    return "#9ca3af"; // gray
  };

  return (
    <HoverCardContent className="w-80 p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold">{passport.passport_id}</h3>
            <p className="text-sm text-muted-foreground">
              {passport.owner_address.substring(0, 6)}...{passport.owner_address.substring(passport.owner_address.length - 4)}
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-full bg-secondary/80 backdrop-blur-sm">
            <Shield className={`h-4 w-4 ${passport.colorClass}`} />
            <span className={`text-xs font-semibold ${passport.colorClass}`}>CVB {passport.score}</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
            <Award className="h-4 w-4" /> Verification Level
          </h4>
          <div className="bg-secondary/50 rounded-full h-2.5 mb-1">
            <div 
              className={`h-2.5 rounded-full ${
                passport.score >= 90 ? "bg-purple-500" : 
                passport.score >= 75 ? "bg-indigo-500" : 
                passport.score >= 60 ? "bg-blue-500" : 
                passport.score >= 45 ? "bg-emerald-500" : 
                passport.score >= 30 ? "bg-amber-500" : "bg-gray-500"
              }`} 
              style={{ width: `${passport.score}%` }}
            ></div>
          </div>
          <div className="flex justify-between">
            <p className="text-xs text-muted-foreground">{passport.category}</p>
            <div className="flex text-xs text-muted-foreground gap-2">
              <div className="flex items-center gap-1">
                <Check className="h-3 w-3 text-green-500" />
                <span>On-chain</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="h-3 w-3 text-green-500" />
                <span>Verified</span>
              </div>
            </div>
          </div>
        </div>

        {passport.socials && Object.values(passport.socials).some(Boolean) && (
          <div>
            <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
              <Globe className="h-4 w-4" /> Connected Accounts
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(passport.socials).map(([platform, value]) => 
                value && (
                  <Badge key={platform} variant="outline" className="text-xs">
                    {platform}
                  </Badge>
                )
              )}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
            <FileText className="h-4 w-4" /> Contribution Metrics
          </h4>
          <svg ref={projectsRef} className="mx-auto"></svg>
        </div>

        <div>
          <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
            <Box className="h-4 w-4" /> Project Connections
          </h4>
          <svg ref={networkRef} className="mx-auto"></svg>
        </div>
      </div>
    </HoverCardContent>
  );
};

export default UserCardTooltip;
