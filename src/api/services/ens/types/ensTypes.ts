
/**
 * ENS Profile interface with profile details
 */
export interface EnsProfile {
  name?: string;
  address?: string;
  avatar?: string | null;
  description?: string | null;
  records?: Record<string, string>;
  socials?: Record<string, string>;
}
