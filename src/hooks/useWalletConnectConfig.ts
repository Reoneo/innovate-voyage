
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WalletConnectConfig {
  projectId: string | null;
  isLoading: boolean;
  error: string | null;
}

export const useWalletConnectConfig = (): WalletConnectConfig => {
  const [config, setConfig] = useState<WalletConnectConfig>({
    projectId: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-walletconnect-config');
        
        if (error) {
          setConfig({
            projectId: null,
            isLoading: false,
            error: error.message || 'Failed to fetch WalletConnect config',
          });
          return;
        }

        setConfig({
          projectId: data?.projectId || null,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        setConfig({
          projectId: null,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    };

    fetchConfig();
  }, []);

  return config;
};
