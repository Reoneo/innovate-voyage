
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

const ProfileSkeleton = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Animated cube background similar to ThreeJsBackground */}
      <div className="absolute inset-0">
        {/* Generate floating animated cubes */}
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <div
              className="w-4 h-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 transform rotate-45 animate-bounce"
              style={{
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          </div>
        ))}
        
        {/* Larger accent cubes */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`large-${i}`}
            className="absolute animate-spin"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${8 + Math.random() * 4}s`
            }}
          >
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500/30 to-purple-500/30 transform rotate-45 border border-cyan-500/20" />
          </div>
        ))}
      </div>
      
      {/* Dark overlay for better content visibility */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>
      
      <div
        className={`container relative z-10 ${
          isMobile ? 'px-1 pt-16' : 'px-4 pt-20'
        }`}
        style={{ maxWidth: isMobile ? '100vw' : '98vw' }}
      >
        {isMobile ? (
          // Mobile Layout Skeleton
          <div className="w-full max-w-full space-y-2 px-1 pb-safe">
            {/* Profile Header - Mobile */}
            <Card className="w-full">
              <CardContent className="p-3">
                <div className="flex flex-col items-center space-y-2">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </CardContent>
            </Card>

            {/* Social Links - Mobile */}
            <Card className="w-full">
              <CardContent className="p-2">
                <div className="flex justify-center gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-12 rounded-full" />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats - Mobile */}
            <Card className="w-full">
              <CardContent className="p-3">
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-16 w-full rounded" />
                  <Skeleton className="h-16 w-full rounded" />
                </div>
              </CardContent>
            </Card>

            {/* Additional sections - Mobile */}
            <Card className="w-full">
              <CardContent className="p-3">
                <Skeleton className="h-24 w-full rounded" />
              </CardContent>
            </Card>
          </div>
        ) : (
          // Desktop Layout Skeleton
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-1 space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center space-y-4">
                      <Skeleton className="h-32 w-32 rounded-full" />
                      <Skeleton className="h-8 w-48" />
                      <Skeleton className="h-6 w-64" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-3">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-12 rounded-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-40" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <Skeleton className="h-24 w-full rounded" />
                      <Skeleton className="h-24 w-full rounded" />
                      <Skeleton className="h-24 w-full rounded" />
                      <Skeleton className="h-24 w-full rounded" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-40 w-full rounded" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-36" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full rounded" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileSkeleton;
