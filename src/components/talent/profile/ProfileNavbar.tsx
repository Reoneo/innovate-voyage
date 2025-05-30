
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTalentProtocolRank } from '@/hooks/useTalentProtocolRank';
import { useToast } from '@/hooks/use-toast';

interface ProfileNavbarProps {
  connectedWallet: string | null;
  onDisconnect: () => void;
  onSaveChanges: () => void;
}

const ProfileNavbar: React.FC<ProfileNavbarProps> = ({
  connectedWallet
}) => {
  const [search, setSearch] = useState('');
  const [rankSearch, setRankSearch] = useState<number | undefined>(undefined);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { user: rankUser, loading: rankLoading, error: rankError } = useTalentProtocolRank(rankSearch);

  const handleOpenXmtpModal = () => {
    if (window.xmtpMessageModal) {
      window.xmtpMessageModal.showModal();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    const searchTerm = search.trim();
    
    // Check if search is a rank format like "#10" or "10"
    const rankMatch = searchTerm.match(/^#?(\d+)$/);
    
    if (rankMatch) {
      const rank = parseInt(rankMatch[1], 10);
      
      if (rank > 0 && rank <= 1000) { // Reasonable rank range
        console.log(`Searching for user at rank #${rank}`);
        setRankSearch(rank);
        return;
      } else {
        toast({
          title: "Invalid rank",
          description: "Please enter a rank between 1 and 1000",
          variant: "destructive"
        });
        return;
      }
    }
    
    // Regular ENS/address search
    const searchQuery = searchTerm.toLowerCase();
    navigate(`/recruitment.box/${searchQuery}/`);
    window.location.reload();
  };

  // Handle rank search result
  React.useEffect(() => {
    if (rankUser && !rankLoading) {
      console.log(`Found user at rank #${rankSearch}:`, rankUser);
      
      // Navigate to the user's profile using their address or passport_id
      const identifier = rankUser.name || rankUser.owner_address;
      navigate(`/recruitment.box/${identifier.toLowerCase()}/`);
      window.location.reload();
      
      // Reset rank search
      setRankSearch(undefined);
      setSearch('');
      
      toast({
        title: "User found",
        description: `Loading profile for rank #${rankSearch} user: ${rankUser.name || 'Unknown'}`
      });
    } else if (rankError && rankSearch) {
      console.error('Rank search error:', rankError);
      toast({
        title: "User not found",
        description: `No user found at rank #${rankSearch}`,
        variant: "destructive"
      });
      setRankSearch(undefined);
    }
  }, [rankUser, rankLoading, rankError, rankSearch, navigate, toast]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-600/20 shadow-sm bg-gray-800/30">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between h-14">
        {/* Search form with Home and Chat icons positioned next to it */}
        <form onSubmit={handleSearch} className="flex-1 flex items-center justify-center gap-2">
          <Link to="/" className="text-white hover:text-gray-300 transition-colors">
            <Home className="h-6 w-6" />
          </Link>
          
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
            <Input 
              type="text" 
              placeholder="Search ENS username or rank (#10)..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="pl-10 pr-4 py-2 w-full bg-gray-700/30 border-gray-600/30 text-white rounded-full focus:ring-white focus:border-white" 
              disabled={rankLoading}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 px-3 py-1"
              disabled={rankLoading}
            >
              {rankLoading ? 'Loading...' : 'Search'}
            </Button>
          </div>
          
          <button 
            onClick={handleOpenXmtpModal} 
            className="text-white hover:text-gray-300 transition-colors" 
            aria-label="XMTP Messages"
          >
            {/* New XMTP icon from GitHub repo */}
            <img 
              src="https://raw.githubusercontent.com/xmtp/brand/main/assets/x-mark-red.png" 
              alt="XMTP Messages" 
              className="h-6 w-6"
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileNavbar;
