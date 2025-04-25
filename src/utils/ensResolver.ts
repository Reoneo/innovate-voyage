
// Helper to resolve ENS/avatars in bulk (very basic for now)
export async function getEnsData(address: string): Promise<{ ensName?: string; avatar?: string }> {
  try {
    const resp = await fetch(`https://api.web3.bio/profile/${address}`);
    const data = await resp.json();
    return {
      ensName: data.ens?.name,
      avatar: data.ens?.avatar,
    };
  } catch (e) {
    return {};
  }
}

export function shortenAddress(addr: string) {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';
}
