
// ENS API base URL - you can change this to your self-hosted instance
const ENS_API_BASE = 'https://ens-api.vercel.app';

export async function getEnsLinks(ensName: string, networkName: string = 'mainnet') {
  // Default result structure
  const result = {
    socials: {} as Record<string, string>,
    ensLinks: [] as string[],
    description: undefined as string | undefined,
    keywords: [] as string[]
  };
  
  try {
    // If the name doesn't end with .eth or .box, return empty result
    if (!ensName.endsWith('.eth') && !ensName.endsWith('.box')) {
      return result;
    }
    
    console.log(`Getting ENS links for ${ensName} using ENS API`);
    
    // Fetch all text records we're interested in
    const textKeys = [
      'com.github', 'com.twitter', 'com.discord', 'com.linkedin', 'org.telegram',
      'com.reddit', 'email', 'url', 'description', 'avatar',
      'com.instagram', 'io.keybase', 'xyz.lens', 'location', 'com.youtube',
      'app.bsky', 'com.whatsapp', 'phone', 'name', 'notice', 'keywords'
    ].join(',');
    
    const response = await fetch(`${ENS_API_BASE}/name/${ensName}?texts=${textKeys}`, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      console.log(`ENS API returned status ${response.status} for ${ensName}`);
      return result;
    }
    
    const data = await response.json();
    const texts = data.texts || {};
    
    // Map the records to our result structure
    Object.entries(texts).forEach(([key, value]: [string, any]) => {
      if (!value) return;
      
      switch (key) {
        case 'com.github':
          result.socials.github = value;
          break;
        case 'com.twitter':
          result.socials.twitter = value;
          break;
        case 'com.discord':
          result.socials.discord = value;
          break;
        case 'com.linkedin':
          result.socials.linkedin = value;
          console.log('Found LinkedIn in ENS records:', value);
          break;
        case 'org.telegram':
          result.socials.telegram = value;
          break;
        case 'com.reddit':
          result.socials.reddit = value;
          break;
        case 'email':
          result.socials.email = value;
          break;
        case 'com.whatsapp':
          result.socials.whatsapp = value;
          break;
        case 'app.bsky':
          result.socials.bluesky = value;
          break;
        case 'url':
          result.socials.website = value;
          break;
        case 'phone':
          result.socials.telephone = value;
          break;
        case 'location':
          result.socials.location = value;
          break;
        case 'com.instagram':
          result.socials.instagram = value;
          break;
        case 'com.youtube':
          result.socials.youtube = value;
          break;
        case 'description':
          result.description = value;
          break;
        case 'keywords':
          // Handle keywords - could be comma-separated or space-separated
          result.keywords = value.split(/[,\s]+/).filter((k: string) => k.trim().length > 0);
          break;
        default:
          break;
      }
    });
    
    console.log(`ENS API links result for ${ensName}:`, result);
    return result;
    
  } catch (error) {
    console.error(`Error fetching ENS links for ${ensName}:`, error);
    return result;
  }
}
