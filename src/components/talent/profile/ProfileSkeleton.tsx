
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-lg rotate-45 animate-bounce"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-blue-500/10 rounded-full animate-pulse delay-1000"></div>
      </div>
      
      <div className="container px-4 pt-20 relative z-10" style={{ maxWidth: '98vw' }}>
        <div className="max-w-7xl mx-auto">
          {/* Loading Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-500/30 mb-6">
              <div className="w-4 h-4 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-300 font-medium">Loading Profile Data...</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-10 gap-6">
            {/* Left Column - Avatar Section */}
            <div className="md:col-span-3 space-y-6">
              <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/30 shadow-2xl shadow-cyan-500/20">
                <CardHeader className="text-center">
                  <div className="relative mx-auto mb-4">
                    <Skeleton className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 animate-pulse" />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-xl animate-pulse"></div>
                  </div>
                  <Skeleton className="h-8 w-40 mx-auto bg-gradient-to-r from-cyan-500/30 to-purple-500/30 animate-pulse" />
                  <Skeleton className="h-4 w-32 mx-auto mt-2 bg-gray-600/50 animate-pulse" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-gray-600/50 animate-pulse" />
                    <Skeleton className="h-4 w-3/4 bg-gray-600/50 animate-pulse delay-150" />
                    <Skeleton className="h-4 w-1/2 bg-gray-600/50 animate-pulse delay-300" />
                  </div>
                  
                  {/* Social Links Skeleton */}
                  <div className="grid grid-cols-3 gap-3 pt-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Skeleton key={i} className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Content Sections */}
            <div className="md:col-span-7 space-y-6">
              {/* Talent Score Banner Skeleton */}
              <Card className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 backdrop-blur-sm border-purple-500/30 shadow-2xl shadow-purple-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32 bg-purple-400/30 animate-pulse" />
                      <Skeleton className="h-4 w-48 bg-gray-600/50 animate-pulse delay-200" />
                    </div>
                    <Skeleton className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 animate-pulse" />
                  </div>
                </CardContent>
              </Card>

              {/* GitHub Section Skeleton */}
              <Card className="bg-black/40 backdrop-blur-sm border-gray-600/30 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-center gap-2">
                    <Skeleton className="h-4 w-4 rounded bg-gray-500/50 animate-pulse" />
                    <Skeleton className="h-5 w-40 bg-gray-600/50 animate-pulse" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100/10 rounded-lg p-4 border border-gray-600/30">
                    <div className="grid grid-cols-12 gap-1">
                      {Array.from({ length: 371 }).map((_, i) => (
                        <Skeleton 
                          key={i} 
                          className="h-2.5 w-2.5 bg-gray-600/30 animate-pulse" 
                          style={{ animationDelay: `${(i % 50) * 20}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Loading Steps */}
          <div className="mt-12 max-w-md mx-auto">
            <Card className="bg-black/20 backdrop-blur-sm border-cyan-500/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { text: "Fetching ENS records, blockchain data, and social profiles", active: true },
                    { text: "Loading talent scores...", active: false },
                    { text: "Loading avatar...", active: false },
                    { text: "Resolving identity...", active: false },
                    { text: "Loading GitHub activity...", active: false },
                    { text: "Loading bio and description...", active: false },
                    { text: "Loading blockchain data...", active: false },
                    { text: "Fetching social links...", active: false }
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${step.active ? 'bg-cyan-400 animate-pulse' : 'bg-gray-600/50'}`}></div>
                      <span className={`text-sm ${step.active ? 'text-cyan-300' : 'text-gray-400'}`}>
                        {step.text}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
