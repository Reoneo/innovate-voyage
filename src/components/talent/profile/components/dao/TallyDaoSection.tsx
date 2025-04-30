
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, X } from 'lucide-react';
import { fetchTallyDaoData, TallyDaoData } from '@/api/services/tallyService';

interface TallyDaoSectionProps {
  walletAddress?: string;
  showDaoData?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const TallyDaoSection: React.FC<TallyDaoSectionProps> = ({
  walletAddress,
  showDaoData = false,
  onOpenChange
}) => {
  const [daoData, setDaoData] = useState<TallyDaoData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'delegators' | 'delegating'>('delegators');

  useEffect(() => {
    if (!walletAddress || !showDaoData) return;

    const loadDaoData = async () => {
      setLoading(true);
      try {
        const data = await fetchTallyDaoData(walletAddress);
        setDaoData(data);
      } catch (error) {
        console.error('Error loading DAO data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDaoData();
  }, [walletAddress, showDaoData]);

  if (!walletAddress) return null;

  return (
    <Dialog open={showDaoData} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 z-10 flex justify-between items-center bg-white pb-2">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <img 
                  src="https://substackcdn.com/image/fetch/w_1360,c_limit,f_webp,q_auto:best,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F16e04a51-6718-44ad-b41e-01598da994b6_1280x1280.png" 
                  alt="Tally DAO" 
                  className="w-8 h-8"
                />
                <span>Tally DAO Governance</span>
              </div>
            </DialogTitle>
          </DialogHeader>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange?.(false)}
            className="rounded-full h-8 w-8"
          >
            <X size={18} />
          </Button>
        </div>

        <div className="flex gap-2 mb-4">
          <div className="bg-gray-100 rounded-full p-1 flex">
            <Button 
              onClick={() => setSelectedTab('delegators')} 
              variant={selectedTab === 'delegators' ? "default" : "ghost"}
              size="sm"
              className="rounded-full"
            >
              Delegators
            </Button>
            <Button 
              onClick={() => setSelectedTab('delegating')} 
              variant={selectedTab === 'delegating' ? "default" : "ghost"}
              size="sm"
              className="rounded-full"
            >
              Delegating To
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : daoData && daoData.length > 0 ? (
          <div className="space-y-4">
            {daoData.map((dao, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={dao.dao.logo} 
                        alt={dao.dao.name} 
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-medium">{dao.dao.name}</h3>
                        <p className="text-xs text-gray-500">DAO</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-center">
                      <h4 className="text-sm text-gray-500">Voting Power</h4>
                      <p className="font-medium">
                        {dao.votingPower.value} <span className="text-gray-500 text-sm">{dao.votingPower.percentage}</span>
                      </p>
                    </div>
                    
                    <div className="flex flex-col justify-center">
                      <h4 className="text-sm text-gray-500">Received Delegations</h4>
                      <p className="font-medium">
                        {dao.delegations.count} <span className="text-gray-500 text-sm">{dao.delegations.label}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="text-right text-sm text-gray-500">
              <span>Powered by </span>
              <a 
                href="https://www.tally.xyz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Tally
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">No DAO governance data found for this address</p>
            <a 
              href="https://www.tally.xyz" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline text-sm mt-2 inline-flex items-center gap-1"
            >
              Learn more about Tally <ExternalLink size={14} />
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TallyDaoSection;
