
import { useState } from 'react';

/**
 * Hook to manage node selection state
 */
export function useNodeSelection() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  
  return {
    selectedNode,
    setSelectedNode
  };
}
