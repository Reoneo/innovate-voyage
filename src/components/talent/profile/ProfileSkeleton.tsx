import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
const ProfileSkeleton = () => {
  return <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Animated cube background similar to ThreeJsBackground */}
      <div className="absolute inset-0">
        {/* Generate floating animated cubes */}
        {Array.from({
        length: 50
      }).map((_, i) => <div key={i} className="absolute animate-pulse" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 3}s`,
        animationDuration: `${2 + Math.random() * 2}s`
      }}>
            <div className="w-4 h-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 transform rotate-45 animate-bounce" style={{
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${3 + Math.random() * 2}s`
        }} />
          </div>)}
        
        {/* Larger accent cubes */}
        {Array.from({
        length: 20
      }).map((_, i) => <div key={`large-${i}`} className="absolute animate-spin" style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 4}s`,
        animationDuration: `${8 + Math.random() * 4}s`
      }}>
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500/30 to-purple-500/30 transform rotate-45 border border-cyan-500/20" />
          </div>)}
      </div>
      
      {/* Dark overlay for better content visibility */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>
      
      <div className="container px-1 relative z-10" style={{
      maxWidth: '98vw'
    }}>
        
      </div>
    </div>;
};
export default ProfileSkeleton;