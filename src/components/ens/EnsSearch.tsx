
import React, { useState } from 'react';
import { useEnsAddress, useEnsName } from 'wagmi';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { normalize } from 'viem/ens';
import { isAddress } from 'viem';

const EnsSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const isAddressQuery = isAddress(searchTerm);
  
  const { data: resolvedAddress, isLoading: isLoadingAddress } = useEnsAddress({
    name: !isAddressQuery && searchTerm ? normalize(searchTerm) : undefined,
    chainId: 1,
  });

  const { data: resolvedName, isLoading: isLoadingName } = useEnsName({
    address: isAddressQuery ? searchTerm as `0x${string}` : undefined,
    chainId: 1,
  });

  const handleSearch = () => {
    setSearchTerm(query.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const isLoading = isLoadingAddress || isLoadingName;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">ENS Lookup</h3>
      
      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          placeholder="Enter ENS name or Ethereum address"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={!query.trim() || isLoading}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {searchTerm && (
        <div className="space-y-2">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          ) : (
            <>
              {isAddressQuery ? (
                <div>
                  <p className="text-sm text-gray-600">Address:</p>
                  <p className="font-mono text-sm">{searchTerm}</p>
                  {resolvedName ? (
                    <>
                      <p className="text-sm text-gray-600 mt-2">ENS Name:</p>
                      <p className="font-semibold">{resolvedName}</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">No ENS name found</p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600">ENS Name:</p>
                  <p className="font-semibold">{searchTerm}</p>
                  {resolvedAddress ? (
                    <>
                      <p className="text-sm text-gray-600 mt-2">Address:</p>
                      <p className="font-mono text-sm">{resolvedAddress}</p>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">No address found</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </Card>
  );
};

export default EnsSearch;
