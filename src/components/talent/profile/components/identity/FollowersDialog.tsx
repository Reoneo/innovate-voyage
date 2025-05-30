
import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { EfpPerson } from '@/hooks/useEfpStats';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { useDebounce } from '@/hooks/use-debounce';
import { X } from 'lucide-react';

// Utility function to shorten Ethereum addresses
function shortenAddress(addr: string) {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
}

interface FollowersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dialogType: 'followers' | 'following';
  followersList: EfpPerson[] | undefined;
  followingList: EfpPerson[] | undefined;
  handleFollow: (address: string) => Promise<void>;
  isFollowing: (address: string) => boolean;
  followLoading: { [key: string]: boolean };
  isProcessing?: boolean;
}

const FollowersDialog: React.FC<FollowersDialogProps> = ({ 
  open, 
  onOpenChange, 
  dialogType, 
  followersList, 
  followingList,
  isProcessing = false
}) => {
  const efpLogo = 'https://storage.googleapis.com/zapper-fi-assets/apps%2Fethereum-follow-protocol.png';
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  
  const list = dialogType === 'followers' ? followersList : followingList;
  const totalItems = list?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Memoize the current items to avoid recalculation on each render
  const currentItems = React.useMemo(() => {
    return list?.slice(
      (currentPage - 1) * itemsPerPage, 
      currentPage * itemsPerPage
    ) || [];
  }, [list, currentPage, itemsPerPage]);
  
  // Debounced page change to prevent rapid pagination clicks
  const debouncedSetPage = useDebounce((page: number) => {
    setCurrentPage(page);
    
    // Scroll to top of dialog content when changing pages
    const dialogContent = document.querySelector('.dialog-content');
    if (dialogContent) {
      dialogContent.scrollTop = 0;
    }
  }, 100);
  
  const handlePageChange = useCallback((page: number) => {
    debouncedSetPage(page);
  }, [debouncedSetPage]);
  
  // Generate pagination items with memoization
  const paginationItems = React.useMemo(() => {
    const items = [];
    const maxPageButtons = 5; // Show maximum 5 page buttons
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    
    if (endPage - startPage < maxPageButtons - 1) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i} 
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  }, [currentPage, totalPages, handlePageChange]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        setCurrentPage(1); // Reset to page 1 when closing
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="dialog-content sm:max-w-md">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <img 
              src={efpLogo}
              className="h-6 w-6 rounded-full"
              alt="EFP"
            />
            {dialogType === 'followers' ? 'Followers' : 'Following'} 
            <span className="text-sm font-normal">({totalItems})</span>
          </DialogTitle>
          
          {/* Close button */}
          <button 
            onClick={() => onOpenChange(false)}
            className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        
        <div className="py-4">
          {(currentItems && currentItems.length > 0) ? (
            <>
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {currentItems.map((person, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <a 
                      href={`/${person.ensName || person.address}/`}
                      className="flex items-center gap-3 flex-grow hover:text-primary"
                    >
                      <Avatar>
                        <AvatarImage src={person.avatar} />
                        <AvatarFallback>
                          {person.ensName
                            ? person.ensName.substring(0, 2).toUpperCase()
                            : shortenAddress(person.address).substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{person.ensName || shortenAddress(person.address)}</p>
                        {person.ensName && (
                          <p className="text-xs text-muted-foreground">{shortenAddress(person.address)}</p>
                        )}
                      </div>
                    </a>
                  </div>
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => handlePageChange(currentPage - 1)} 
                          />
                        </PaginationItem>
                      )}
                      
                      {paginationItems}
                      
                      {currentPage < totalPages && (
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => handlePageChange(currentPage + 1)} 
                          />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <p className="text-center text-muted-foreground">
              {isProcessing ? 'Loading...' : `No ${dialogType} found`}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowersDialog;
