
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, MapPin } from 'lucide-react';
import { useEnsSearch } from '@/hooks/useEnsSearch';
import { getPopularCountries, EnsUser } from '@/api/services/ensSearchService';
import EnsUserCard from './EnsUserCard';

const EnsSearch: React.FC = () => {
  const [searchCountry, setSearchCountry] = useState('');
  const { searchResults, isLoading, error, searchUsers, loadMore, resetSearch } = useEnsSearch();
  const navigate = useNavigate();

  const popularCountries = getPopularCountries();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCountry.trim()) {
      searchUsers(searchCountry.trim());
    }
  };

  const handleCountrySelect = (country: string) => {
    setSearchCountry(country);
    searchUsers(country);
  };

  const handleUserClick = (user: EnsUser) => {
    navigate(`/${user.ensName}`);
  };

  const handleReset = () => {
    setSearchCountry('');
    resetSearch();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Search ENS Users by Country
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter country name..."
              value={searchCountry}
              onChange={(e) => setSearchCountry(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!searchCountry.trim() || isLoading}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            {searchResults && (
              <Button variant="outline" onClick={handleReset}>
                Clear
              </Button>
            )}
          </form>

          {/* Popular Countries */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Popular countries:</p>
            <div className="flex flex-wrap gap-2">
              {popularCountries.map((country) => (
                <Button
                  key={country}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCountrySelect(country)}
                  disabled={isLoading}
                >
                  {country}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200">
          <CardContent className="p-4">
            <p className="text-red-600">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {searchResults && (
        <Card>
          <CardHeader>
            <CardTitle>
              Found {searchResults.total} users in {searchCountry}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Users Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
              {searchResults.users.map((user) => (
                <EnsUserCard
                  key={`${user.address}-${user.ensName}`}
                  user={user}
                  onClick={handleUserClick}
                />
              ))}
            </div>

            {/* Loading Skeletons */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center space-y-3">
                        <Skeleton className="w-16 h-16 rounded-full" />
                        <div className="space-y-2 text-center">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {searchResults.hasMore && !isLoading && (
              <div className="text-center">
                <Button onClick={loadMore} variant="outline">
                  Load More Users
                </Button>
              </div>
            )}

            {/* No More Results */}
            {!searchResults.hasMore && searchResults.users.length > 0 && (
              <div className="text-center text-muted-foreground">
                <p>All users loaded</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnsSearch;
