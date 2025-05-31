
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HoneycombProfile from './HoneycombProfile';

const FeaturedProfileSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const profileSets = [
    {
      title: "Featured Profiles",
      profiles: ['smith.box', 'spyda.eth', 'zorida.eth']
    },
    {
      title: ".Box Community Members",
      profiles: [
        'ohms.box', 'black.box', 'hax.box', 'phantom.box', 'bing.box', 
        'hunter.box', 'mike.box', 'smith.box', 'blockchaineazy.box', 
        'stars.box', 'mystic.box', 'doom.box', 'seansky.box', 
        'onigiri.box', 'cypherpunk.box', 'yx.box', 'dude.box'
      ]
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % profileSets.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + profileSets.length) % profileSets.length);
  };

  const currentSet = profileSets[currentSlide];
  const isBoxCommunity = currentSlide === 1;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-center mb-4 relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="absolute left-0 h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="text-lg font-semibold text-slate-300 text-center">
          Browse Profiles
        </h3>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="absolute right-0 h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <h4 className="text-md font-medium text-slate-400 mb-4 text-center">
        {currentSet.title}
      </h4>
      
      {/* Profiles Grid - Added extra spacing for names */}
      <div className="relative flex justify-center items-center mb-8">
        {isBoxCommunity ? (
          /* Grid layout for Box Community Members */
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-start max-w-4xl">
            {currentSet.profiles.map((profile, index) => (
              <div key={profile} className="flex justify-center">
                <HoneycombProfile ensName={profile} delay={index * 50} showName={true} />
              </div>
            ))}
          </div>
        ) : (
          /* Honeycomb layout for Featured Profiles */
          <div className="grid grid-cols-2 gap-6 items-start">
            {/* Top row - 2 profiles */}
            <div className="flex justify-center">
              <HoneycombProfile ensName={currentSet.profiles[0]} delay={0} showName={true} />
            </div>
            <div className="flex justify-center">
              <HoneycombProfile ensName={currentSet.profiles[1]} delay={200} showName={true} />
            </div>
            
            {/* Bottom row - 1 profile centered */}
            <div className="col-span-2 flex justify-center">
              <HoneycombProfile ensName={currentSet.profiles[2]} delay={400} showName={true} />
            </div>
          </div>
        )}
      </div>

      {/* Slide indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {profileSets.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              index === currentSlide ? 'bg-blue-400' : 'bg-slate-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProfileSection;
