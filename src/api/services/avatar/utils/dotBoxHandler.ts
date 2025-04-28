
import { avatarCache } from '../../../utils/web3/index';

export async function handleDotBoxAvatar(identity: string): Promise<string | null> {
  try {
    console.log(`Fetching .box avatar for ${identity}`);
    
    // First try web3.bio API
    const boxProfile = await fetch(`https://api.web3.bio/profile/dotbit/${identity}?nocache=${Date.now()}`, {
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiNDkyNzREIiwiZXhwIjoyMjA1OTExMzI0LCJyb2xlIjo2fQ.dGQ7o_ItgDU8X_MxBlja4in7qvGWtmKXjqhCHq2gX20`,
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (boxProfile.ok) {
      const boxData = await boxProfile.json();
      if (boxData && boxData.avatar) {
        console.log(`Found .box avatar via web3.bio for ${identity}`);
        avatarCache[identity] = boxData.avatar;
        return boxData.avatar;
      }
    }
    
    // Fallback to .bit API
    const bitProfile = await fetch(`https://did.id/v1/account/${identity}`);
    if (bitProfile.ok) {
      const bitData = await bitProfile.json();
      if (bitData?.data?.avatar) {
        console.log(`Found .box avatar via .bit for ${identity}`);
        avatarCache[identity] = bitData.data.avatar;
        return bitData.data.avatar;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching .box avatar for ${identity}:`, error);
    return null;
  }
}
