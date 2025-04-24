
import { useEffect, useState } from "react";

// Util to shorten an Ethereum address
function shortenAddress(addr: string) {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : '';
}

export interface EfpPerson {
  address: string;
  ensName?: string;
  avatar?: string;
}
export interface EfpStats {
  following: number;
  followers: number;
  followingList?: EfpPerson[];
  followersList?: EfpPerson[];
}

const ETHERSCAN_API = "https://api.etherscan.io/api?module=account&action=txlist";

// Helper to resolve ENS/avatars in bulk (very basic for now)
async function getEnsData(address: string): Promise<{ ensName?: string; avatar?: string }> {
  try {
    // Use ENS registry/public mainnet endpoint or a public ENS lookup API via web3.bio
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

export function useEfpStats(walletAddress?: string) {
  const [stats, setStats] = useState<EfpStats>({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!walletAddress) return;
    setLoading(true);

    async function fetchEfp() {
      try {
        // Get EFP followers/following list.
        // For demo, EFP API: https://api.ethereumfollowprotocol.xyz
        // If EFP API unavailable, fallback to empty results.

        const efpUrl = (type: "followers" | "following") =>
          `https://api.ethereumfollowprotocol.xyz/v1/wallet/${walletAddress}/${type}`;

        // Fetch both lists
        const [followersRes, followingRes] = await Promise.all([
          fetch(efpUrl("followers")),
          fetch(efpUrl("following")),
        ]);

        const followersJson = followersRes.ok ? await followersRes.json() : [];
        const followingJson = followingRes.ok ? await followingRes.json() : [];

        // followersJson = array of addresses
        const followersAddresses: string[] = Array.isArray(followersJson) ? followersJson : [];
        const followingAddresses: string[] = Array.isArray(followingJson) ? followingJson : [];

        // Fetch ENS data for all accounts in parallel (throttled)
        const resolveList = async (addrs: string[]) => {
          const results: EfpPerson[] = [];
          for (let addr of addrs) {
            const { ensName, avatar } = await getEnsData(addr);
            results.push({
              address: addr,
              ensName,
              avatar,
            });
          }
          return results;
        };

        const [followersList, followingList] = await Promise.all([
          resolveList(followersAddresses),
          resolveList(followingAddresses),
        ]);

        if (!cancelled) {
          setStats({
            followers: followersList.length,
            followersList: followersList.map(p =>
              ({ ...p, ensName: p.ensName, avatar: p.avatar, address: p.address, display: p.ensName || shortenAddress(p.address) })
            ),
            following: followingList.length,
            followingList: followingList.map(p =>
              ({ ...p, ensName: p.ensName, avatar: p.avatar, address: p.address, display: p.ensName || shortenAddress(p.address) })
            ),
          });
        }
      } catch (e) {
        if (!cancelled) {
          setStats({ followers: 0, following: 0, followersList: [], followingList: [] });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchEfp();
    return () => { cancelled = true; }
  }, [walletAddress]);

  return { ...stats, loading };
}
