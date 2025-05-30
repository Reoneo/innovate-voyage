
import React from 'react';

const HeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      {/* Animated circuit lines */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-10 left-10 w-px h-32 bg-gradient-to-b from-cyan-400 to-transparent animate-pulse"></div>
          <div className="absolute top-10 left-10 w-32 h-px bg-gradient-to-r from-cyan-400 to-transparent animate-pulse delay-300"></div>
          <div className="absolute top-20 right-20 w-px h-24 bg-gradient-to-b from-purple-400 to-transparent animate-pulse delay-700"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-px bg-gradient-to-r from-blue-400 to-transparent animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 right-1/3 w-px h-28 bg-gradient-to-b from-cyan-400 to-transparent animate-pulse delay-500"></div>
        </div>
      </div>

      {/* Floating geometric shapes with glow */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-cyan-500/20 rounded-full animate-pulse shadow-2xl shadow-cyan-500/50"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/20 rounded-lg rotate-45 animate-bounce shadow-2xl shadow-purple-500/50"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-blue-500/15 rounded-full animate-pulse delay-1000 shadow-2xl shadow-blue-500/50"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-cyan-500/20 rounded-lg rotate-12 animate-bounce delay-500 shadow-2xl shadow-cyan-500/50"></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-purple-400/10 rounded-full animate-ping shadow-2xl shadow-purple-400/50"></div>
      </div>
      
      {/* Enhanced grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      
      {/* Multiple gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/20 to-purple-900/20"></div>
    </div>
  );
};

export default HeroBackground;
