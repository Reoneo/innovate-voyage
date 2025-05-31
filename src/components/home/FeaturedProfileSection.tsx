
import React from 'react';
import HoneycombProfile from './HoneycombProfile';

const FeaturedProfileSection: React.FC = () => {
  const featuredProfiles = ['smith.box', 'spyda.eth', 'zorida.eth'];

  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-slate-300 mb-8 text-center">
        Featured Profiles
      </h3>
      
      {/* Honeycomb Grid */}
      <div className="relative flex justify-center items-center">
        <div className="grid grid-cols-2 gap-0 items-center"> {/* Changed gap-4 to gap-0 */}
          {/* Top row - 2 profiles */}
          <div className="flex justify-center">
            <HoneycombProfile ensName={featuredProfiles[0]} delay={0} />
          </div>
          <div className="flex justify-center">
            <HoneycombProfile ensName={featuredProfiles[1]} delay={200} />
          </div>
          
          {/* Bottom row - 1 profile centered */}
          <div className="col-span-2 flex justify-center -mt-4"> {/* Increased negative margin to connect better */}
            <HoneycombProfile ensName={featuredProfiles[2]} delay={400} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProfileSection;
