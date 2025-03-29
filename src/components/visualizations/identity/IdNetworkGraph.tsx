import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { useQuery } from '@tanstack/react-query';
import { web3Api } from '@/api/web3Api';
import { useSkillNfts } from '@/hooks/useWeb3';

interface IdNetworkGraphProps {
  name: string;
  avatarUrl?: string;
  ensName?: string;
  address?: string;
}

const IdNetworkGraph: React.FC<IdNetworkGraphProps> = ({ 
  name, 
  avatarUrl, 
  ensName, 
  address 
}) => {
  const networkRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  // Get resolved address
  const resolvedAddress = address || (ensName && !ensName.includes('.eth')) ? ensName : undefined;
  
  // Fetch all ENS domains for this address
  const { data: ensDomainsData } = useQuery({
    queryKey: ['ensRecords', resolvedAddress],
    queryFn: async () => {
      if (!resolvedAddress) return [];
      try {
        // Get all ENS domains owned by this address
        const records = await web3Api.getAllEnsRecords();
        return records.filter(record => 
          record.address.toLowerCase() === resolvedAddress.toLowerCase()
        );
      } catch (error) {
        console.error("Error fetching ENS domains:", error);
        return [];
      }
    },
    enabled: !!resolvedAddress,
  });

  // Get other web3 profile data
  const { data: web3BioProfile } = useQuery({
    queryKey: ['web3BioProfile', ensName || resolvedAddress],
    queryFn: async () => {
      if (!ensName && !resolvedAddress) return null;
      try {
        return await web3Api.fetchWeb3BioProfile(ensName || resolvedAddress || '');
      } catch (error) {
        console.error("Error fetching Web3 Bio Profile:", error);
        return null;
      }
    },
    enabled: !!(ensName || resolvedAddress),
  });

  // Get NFT data
  const { data: skillNfts } = useSkillNfts(resolvedAddress);

  // Generate network graph
  useEffect(() => {
    if (!networkRef.current) return;

    // Full container size with margins
    const width = 400;
    const height = 300;
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };

    // Clear previous visualization
    d3.select(networkRef.current).selectAll("*").remove();

    const svg = d3.select(networkRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    // Create nodes for the identity network
    const centralNode = { id: 'central', name, type: 'user', avatar: avatarUrl };
    
    // Main ENS domain node
    const mainEnsNode = ensName ? { 
      id: 'main-ens', 
      name: ensName, 
      type: 'ens-main' 
    } : null;
    
    // Additional ENS domains
    const ensNodes = ensDomainsData?.filter(domain => 
      domain.ensName !== ensName
    ).map((domain, idx) => ({
      id: `ens-${idx}`,
      name: domain.ensName,
      type: 'ens-other',
      avatar: domain.avatar
    })) || [];
    
    // Identity-related NFTs
    const identityNfts = skillNfts?.filter(nft => 
      nft.name.toLowerCase().includes('identity') || 
      nft.name.toLowerCase().includes('passport') ||
      nft.name.toLowerCase().includes('account') ||
      nft.name.toLowerCase().includes('profile')
    ).map((nft, idx) => ({
      id: `nft-${idx}`,
      name: nft.name,
      type: 'identity-nft',
      image: nft.image
    })) || [];
    
    // Web3 bio platform nodes
    const bioNodes = web3BioProfile?.platform ? [{
      id: 'web3bio',
      name: web3BioProfile.platform,
      type: 'platform'
    }] : [];
    
    // Combine all nodes
    const nodes = [
      centralNode,
      ...(mainEnsNode ? [mainEnsNode] : []),
      ...ensNodes,
      ...identityNfts,
      ...bioNodes
    ];

    // Create links between central node and other identity elements
    const links = [
      // Link to main ENS
      ...(mainEnsNode ? [{ source: 'central', target: 'main-ens', value: 5 }] : []),
      
      // Links to other ENS domains
      ...ensNodes.map(node => ({
        source: 'central',
        target: node.id,
        value: 3
      })),
      
      // Links to NFTs
      ...identityNfts.map(node => ({
        source: 'central',
        target: node.id,
        value: 2
      })),
      
      // Links to web3 bio platforms
      ...bioNodes.map(node => ({
        source: 'central',
        target: node.id,
        value: 2
      }))
    ];

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(30));

    // Add links with appropriate styling
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .join("line")
        .attr("stroke", (d: any) => {
          const target = nodes.find(n => n.id === d.target);
          if (target?.type === 'ens-main') return "#6366f1";
          if (target?.type === 'ens-other') return "#818cf8"; 
          if (target?.type === 'identity-nft') return "#10b981";
          if (target?.type === 'platform') return "#f59e0b";
          return "#9ca3af";
        })
        .attr("stroke-opacity", 0.7)
        .attr("stroke-width", (d: any) => Math.sqrt(d.value) * 1.5);

    // Create node groups
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll(".node")
      .data(nodes)
      .join("g")
        .attr("class", "node")
        .attr("data-id", (d: any) => d.id)
        .attr("data-name", (d: any) => d.name)
        .call(drag(simulation) as any)
        .on("click", (event, d: any) => {
          // Toggle node selection
          setSelectedNode(prev => prev === d.name ? null : d.name);
          
          // Reset all nodes and links
          node.selectAll("circle").attr("stroke-width", 1.5);
          link.attr("stroke-opacity", 0.7).attr("stroke-width", (d: any) => Math.sqrt(d.value) * 1.5);
          
          // Highlight selected node and its connections
          if (selectedNode !== d.name) {
            // Highlight this node
            d3.select(event.currentTarget).select("circle").attr("stroke-width", 3);
            
            // Highlight connected links
            link.filter((l: any) => {
              const source = l.source.id !== undefined ? l.source.id : l.source;
              const target = l.target.id !== undefined ? l.target.id : l.target;
              return source === d.id || target === d.id;
            })
            .attr("stroke-opacity", 1)
            .attr("stroke-width", (l: any) => Math.sqrt(l.value) * 2);
          }
        });

    // Add circles to nodes with styling based on node type
    node.append("circle")
      .attr("r", (d: any) => {
        if (d.type === "user") return 30;
        if (d.type === "ens-main") return 25;
        if (d.type === "ens-other") return 20;
        return 18;
      })
      .attr("fill", (d: any) => {
        if (d.type === "user") {
          if (d.avatar) return `url(#user-avatar)`;
          return "#3b82f6"; 
        }
        if (d.type === "ens-main") return "#6366f1";
        if (d.type === "ens-other") return "#818cf8";
        if (d.type === "identity-nft") return "#10b981";
        if (d.type === "platform") return "#f59e0b";
        return "#9ca3af";
      })
      .attr("stroke", (d: any) => {
        if (d.type === "user") return "#1d4ed8";
        if (d.type === "ens-main") return "#4f46e5";
        if (d.type === "ens-other") return "#4338ca";
        if (d.type === "identity-nft") return "#059669";
        if (d.type === "platform") return "#b45309";
        return "#6b7280";
      })
      .attr("stroke-width", 1.5);

    // If we have an avatar URL, create pattern for the user node
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

    // Add labels with appropriate styling
    node.append("text")
      .attr("dy", (d: any) => d.type === "user" ? 0 : 0)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", (d: any) => {
        if (d.type === "user") return avatarUrl ? "#ffffff" : "#ffffff";
        if (d.type.includes("ens")) return "#ffffff";
        return "#ffffff";
      })
      .attr("font-weight", (d: any) => {
        if (d.type === "user" || d.type.includes("ens")) return "bold"; 
        return "normal";
      })
      .attr("font-size", (d: any) => {
        if (d.type === "user") return "12px";
        if (d.type.includes("ens")) return "11px";
        return "10px";
      })
      .text((d: any) => {
        const displayName = d.name;
        if (d.type === "user") {
          return displayName.length > 12 ? displayName.substring(0, 12) + "..." : displayName;
        } else if (d.type.includes("ens")) {
          return displayName.length > 12 ? displayName.substring(0, 12) + "..." : displayName;
        } else {
          return displayName.length > 10 ? displayName.substring(0, 10) + "..." : displayName;
        }
      });

    // Add background to text for better readability
    node.insert("circle", "text")
      .attr("r", (d: any) => {
        if (d.type === "user") return 25;
        if (d.type === "ens-main") return 22;
        if (d.type === "ens-other") return 18;
        return 16;
      })
      .attr("fill", (d: any) => {
        if (d.type === "user") return avatarUrl ? "transparent" : "#3b82f6";
        if (d.type === "ens-main") return "#6366f1";
        if (d.type === "ens-other") return "#818cf8";
        if (d.type === "identity-nft") return "#10b981";
        if (d.type === "platform") return "#f59e0b";
        return "#9ca3af";
      })
      .attr("opacity", (d: any) => d.type === "user" && avatarUrl ? 0 : 0.9);

    // Add icons or badges for special types
    node.filter((d: any) => d.type.includes("ens"))
      .append("text")
      .attr("x", 12)
      .attr("y", -12)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-weight", "bold")
      .attr("font-size", "10px")
      .text("ENS");

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => {
        // Keep nodes within boundaries
        d.x = Math.max(margin.left + 30, Math.min(width - margin.right - 30, d.x));
        d.y = Math.max(margin.top + 30, Math.min(height - margin.bottom - 30, d.y));
        return `translate(${d.x},${d.y})`;
      });
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

    // Add tooltip
    const tooltip = d3.select("body")
      .append("div")
      .attr("class", "id-network-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(0,0,0,0.8)")
      .style("color", "white")
      .style("padding", "5px 10px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none");

    // Add tooltip behavior
    node.on("mouseover", function(event, d: any) {
      tooltip.style("visibility", "visible")
        .html(() => {
          if (d.type === "user") {
            return `<strong>${d.name}</strong><br>Main profile`;
          } else if (d.type === "ens-main") {
            return `<strong>${d.name}</strong><br>Primary ENS Domain`;
          } else if (d.type === "ens-other") {
            return `<strong>${d.name}</strong><br>Owned ENS Domain`;
          } else if (d.type === "identity-nft") {
            return `<strong>${d.name}</strong><br>Identity NFT`;
          } else if (d.type === "platform") {
            return `<strong>${d.name}</strong><br>Web3 Platform`;
          }
          return `<strong>${d.name}</strong>`;
        })
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

    // Cleanup on unmount
    return () => {
      tooltip.remove();
    };
  }, [ensDomainsData, name, selectedNode, avatarUrl, ensName, web3BioProfile, skillNfts]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <svg 
        ref={networkRef}
        className="w-full h-full"
        style={{ maxHeight: "100%", maxWidth: "100%", overflow: "visible" }}
      ></svg>
      
      {ensDomainsData?.length === 0 && !skillNfts?.length && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
          No identity data available for this address
        </div>
      )}
    </div>
  );
};

export default IdNetworkGraph;
