
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { isValidEthereumAddress } from '@/lib/utils';

export function useProfileIdentity() {
  const { ensNameOrAddress, domain, userId, ensName } = useParams<{
    ensNameOrAddress?: string;
    domain?: string;
    userId?: string;
    ensName?: string;
  }>();
  
  const location = useLocation();
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [ens, setEns] = useState<string | undefined>(undefined);
  const [displayIdentity, setDisplayIdentity] = useState<string>('');
  
  useEffect(() => {
    console.log('TalentProfile params:', { ensNameOrAddress, domain, userId, ensName });
    console.log('Current pathname:', location.pathname);
    
    // Handle different URL formats
    let identityToUse: string | undefined;
    
    // Check if we have a direct ENS name from the /:ensName route
    if (ensName) {
      console.log('Using direct ENS name from route parameter:', ensName);
      identityToUse = ensName;
    }
    // Handle potential host name issues like direct domain access (recruitment.box/30315.eth)
    else if (window.location.hostname === "recruitment.box" && ensNameOrAddress && !domain && !userId) {
      console.log('Detected direct domain access:', window.location.hostname, ensNameOrAddress);
      identityToUse = ensNameOrAddress;
    }
    // Case 1: /recruitment.box/:userId format
    else if (userId && domain === 'recruitment.box') {
      identityToUse = `${userId}.box`;
    }
    // Case 2: /:domain/:userId format
    else if (domain && userId) {
      identityToUse = `${userId}.${domain}`;
    }
    // Case 3: /:ensNameOrAddress format (original)
    else if (ensNameOrAddress) {
      identityToUse = ensNameOrAddress;
    }
    // Special case: handle direct path like /30315.eth
    else if (location.pathname && location.pathname !== '/') {
      // Extract the identity from the pathname
      const pathIdentity = location.pathname.substring(1); // Remove leading slash
      if (pathIdentity) {
        console.log('Extracted identity from pathname:', pathIdentity);
        identityToUse = pathIdentity;
      }
    }
    
    console.log('Identity to use:', identityToUse);
    
    if (identityToUse) {
      if (isValidEthereumAddress(identityToUse)) {
        setAddress(identityToUse);
      } else {
        // Make sure to handle ENS names without extension
        const ensValue = identityToUse.includes('.') ? identityToUse : `${identityToUse}.eth`;
        setEns(ensValue);
      }

      // For display in UI
      setDisplayIdentity(ensName || 
                         (userId && domain ? `${userId}.${domain}` : ensNameOrAddress) || 
                         location.pathname.substring(1));
    }
  }, [ensNameOrAddress, domain, userId, ensName, location.pathname]);

  return {
    address,
    ens,
    displayIdentity
  };
}
