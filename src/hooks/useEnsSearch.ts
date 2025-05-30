
import { useState, useCallback } from 'react';
import { searchEnsByCountry, EnsUser, EnsSearchResult } from '@/api/services/ensSearchService';

export function useEnsSearch() {
  const [searchResults, setSearchResults] = useState<EnsSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCountry, setCurrentCountry] = useState<string>('');

  const searchUsers = useCallback(async (country: string, page: number = 1) => {
    if (!country.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await searchEnsByCountry(country, page, 10);
      
      if (page === 1) {
        setSearchResults(result);
      } else {
        // Append to existing results for pagination
        setSearchResults(prev => prev ? {
          ...result,
          users: [...prev.users, ...result.users]
        } : result);
      }
      
      setCurrentPage(page);
      setCurrentCountry(country);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (searchResults?.hasMore && !isLoading && currentCountry) {
      searchUsers(currentCountry, currentPage + 1);
    }
  }, [searchResults?.hasMore, isLoading, currentCountry, currentPage, searchUsers]);

  const resetSearch = useCallback(() => {
    setSearchResults(null);
    setCurrentPage(1);
    setCurrentCountry('');
    setError(null);
  }, []);

  return {
    searchResults,
    isLoading,
    error,
    currentPage,
    searchUsers,
    loadMore,
    resetSearch
  };
}
