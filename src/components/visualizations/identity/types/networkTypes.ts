
/**
 * Types for ID Network visualization
 */

export interface NetworkNode {
  id: string;
  name: string;
  type: string;
  avatar?: string;
  isDotBox?: boolean;
  image?: string;
}

export interface NetworkLink {
  source: string;
  target: string;
  value: number;
}

export interface NetworkData {
  nodes: NetworkNode[];
  links: NetworkLink[];
}
