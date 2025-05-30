
import React from 'react';

const HeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>

      {/* Floating animated geometric shapes */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500/5 rounded-full animate-[float-glow_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-slate-500/5 rounded-lg rotate-12 animate-[float-delayed-glow_8s_ease-in-out_infinite]"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-slate-400/5 rounded-full animate-[float-glow_7s_ease-in-out_infinite_reverse]"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-purple-500/5 rounded-lg rotate-45 animate-[pulse-color_4s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-28 h-28 bg-cyan-500/5 rounded-full animate-[circuit-flow_5s_ease-in-out_infinite]"></div>
      </div>
      
      {/* Professional gradient overlay with subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 animate-[pulse-color_10s_ease-in-out_infinite]"></div>
      
      {/* Subtle moving light rays */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10px] opacity-30">
          <div className="absolute top-0 -left-4 w-96 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent rotate-12 animate-[slide-in_15s_linear_infinite]"></div>
          <div className="absolute top-1/3 -right-4 w-96 h-px bg-gradient-to-r from-transparent via-slate-400/20 to-transparent -rotate-12 animate-[slide-in_20s_linear_infinite_reverse]"></div>
          <div className="absolute bottom-1/4 -left-4 w-96 h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent rotate-6 animate-[slide-in_18s_linear_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroBackground;
