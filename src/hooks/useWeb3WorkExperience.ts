
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface WorkExperience {
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  verified: boolean;
  description?: string;
}

export function useWeb3WorkExperience(walletAddress?: string) {
  const [experience, setExperience] = useState<WorkExperience[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!walletAddress) return;

    const fetchExperience = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation, this would be an actual API call
        // For now, we'll simulate the API response with a delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data based on wallet address
        // In production, this would be a real API call to Talent Protocol or similar
        const mockData: WorkExperience[] = [
          {
            company: "Aave",
            role: "Smart Contract Developer",
            start_date: "2022-01-01",
            end_date: "2023-01-01",
            verified: true,
            description: "Developed and audited smart contracts for the Aave protocol."
          },
          {
            company: "Uniswap",
            role: "Frontend Engineer",
            start_date: "2021-03-15",
            end_date: "2022-01-01",
            verified: true,
            description: "Built UI components for the Uniswap V3 interface."
          },
          {
            company: "MakerDAO",
            role: "Governance Contributor",
            start_date: "2020-06-01",
            end_date: null,
            verified: false,
            description: "Participated in governance proposals and community discussions."
          }
        ];
        
        setExperience(mockData);
      } catch (err) {
        console.error("Error fetching Web3 work experience:", err);
        setError("Failed to fetch verified work history");
        toast({
          title: "Error",
          description: "Failed to load on-chain work history",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperience();
  }, [walletAddress, toast]);

  return {
    experience,
    isLoading,
    error
  };
}
