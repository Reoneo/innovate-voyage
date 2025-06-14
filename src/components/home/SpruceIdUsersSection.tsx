
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, Activity, ExternalLink } from 'lucide-react';
import { fetchRecentSpruceIdUsers } from '@/api/services/spruceIdService';
import SpruceIdUserCard from './SpruceIdUserCard';

const SpruceIdUsersSection: React.FC = () => {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['spruceIdUsers'],
    queryFn: () => fetchRecentSpruceIdUsers(20),
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 15000, // Consider data stale after 15 seconds
  });

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-blue-600" />
            Recent SpruceID Credentials
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Unable to load recent SpruceID activity</p>
            <p className="text-sm mt-1">Please try again later</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-blue-600" />
            Recent SpruceID Credentials
            {users && (
              <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-800">
                <Activity className="h-3 w-3 mr-1" />
                {users.length} Active
              </Badge>
            )}
          </CardTitle>
          <a
            href="https://www.sprucekit.dev/witness-for-credential-claims/rebase"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <span>Learn about Rebase</span>
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Real-time verified credentials issued through SpruceID's decentralized identity system
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : users && users.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((user) => (
              <SpruceIdUserCard key={user.id} user={user} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No recent SpruceID credential activity</p>
            <p className="text-sm mt-1">
              Check back soon for verified credential updates
            </p>
          </div>
        )}
        
        {users && users.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Showing recent verifiable credentials issued through SpruceID Rebase witness services
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpruceIdUsersSection;
