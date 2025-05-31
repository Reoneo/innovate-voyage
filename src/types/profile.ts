
export interface Profile {
  address: string;
  identity: string;
  avatar?: string;
  description?: string;
  platform?: string;
  socialProfiles?: Record<string, string>;
  links?: Record<string, any>;
}
