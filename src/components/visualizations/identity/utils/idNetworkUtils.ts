
// Network utilities for identity visualization
export function createNetworkData(identities: any[]) {
  // Create network data structure
  return {
    nodes: identities.map((identity, index) => ({
      id: identity.id || `node-${index}`,
      name: identity.name || identity.identity,
      type: identity.platform || 'ethereum'
    })),
    links: []
  };
}

export function processIdentityData(data: any) {
  // Process identity data for visualization
  if (!data) return null;
  
  return {
    identity: data.identity || '',
    platform: data.platform || 'ethereum',
    connections: data.connections || []
  };
}

export function calculateNodePositions(nodes: any[], width: number, height: number) {
  // Calculate positions for nodes in the network
  return nodes.map((node, index) => ({
    ...node,
    x: (width / nodes.length) * index + 50,
    y: height / 2
  }));
}
