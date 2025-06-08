
import React from 'react';

const SimpleLoadingScreen = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-500 mx-auto"></div>
        <div className="text-white text-lg">Loading profile...</div>
      </div>
    </div>
  );
};

export default SimpleLoadingScreen;
