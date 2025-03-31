
export interface POAP {
  event: {
    id: number;
    fancy_id: string;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    expiry_date: string;
    city: string;
    country: string;
    event_url: string;
    image_url: string;
    year: number;
  };
  tokenId: string;
  owner: string;
  chain: string;
  created: string;
}

export interface POAPResponse {
  tokens: POAP[];
  total: number;
}
