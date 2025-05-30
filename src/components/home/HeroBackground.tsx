
import React from 'react';

const HeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Subtle geometric accents */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500/5 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-slate-500/5 rounded-lg rotate-12"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-slate-400/5 rounded-full"></div>
      </div>
      
      {/* Professional gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
    </div>
  );
};

export default HeroBackground;
