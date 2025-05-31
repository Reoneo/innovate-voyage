
// Use explicit named exports instead of star exports to avoid conflicts
export { default as IdNetworkGraph } from './components/IdNetworkVisualization';
export { default as NetworkNode } from './components/NetworkNode';
export { default as NetworkLink } from './components/NetworkLink';

// Export hooks
export { useIdNetworkData } from './hooks/useIdNetworkData';
export { useNetworkVisualization } from './hooks/useNetworkVisualization';

// Export utilities with named exports
export { 
  createNetworkData,
  processIdentityData,
  calculateNodePositions 
} from './utils/idNetworkUtils';
