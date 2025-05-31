
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HoneycombProfile from './HoneycombProfile';

const FeaturedProfileSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [ensClubPage, setEnsClubPage] = useState(1);
  
  const generateEnsClubProfiles = (page: number) => {
    const startNum = (page - 1) * 20 + 1;
    const endNum = Math.min(page * 20, 999);
    return Array.from({ length: endNum - startNum + 1 }, (_, i) => {
      const num = startNum + i;
      return `${num.toString().padStart(3, '0')}.eth`;
    });
  };

  const efpLeaderboardProfiles = [
    'sargent.eth', '👁️‍🗨️.eth', '2️⃣2️⃣.eth', '🐈‍⬛.eth', 'shannon1.eth', 'mmmm.eth', 'going.eth', 'followmeme.eth',
    'furyan.eth', '0xthrpw.eth', 'okarun.eth', 'autist.eth', '👨‍🎤.eth', 'didierkrux.eth', 'deadstock.eth', '🤵🏼‍♂️.eth',
    'slowsort.eth', 'brianarmstrong.eth', 'art.mely.eth', 'bullieverisland.eth', 'efp.encrypteddegen.eth', 'broke.eth',
    'heardle.eth', 'planetos.eth', 'ittalik.eth', '👩🏿‍🦲.eth', 'cryptodon.eth', 'dons.eth', 'captaintoken.eth', 'bobzerah.eth',
    '👩🏻‍🎤.eth', 'tchiktchak.eth', 'yoyodyne.eth', 'poldo.eth', 'odie.eth', 'ohhkaneda.eth', 'wbush.eth', 'utd.eth',
    '🧝🏻‍♀️.eth', 'apostolos.eth', 'pawswap.eth', 'huncho.eth', 'tostada.eth', 'madeintheusa.eth', '2021go.eth', '4444.eth',
    'lagovskii333.eth', 'grado.eth', 'encrypteddegen.eth', 'web3go.eth', 'cordaro.eth', 'spacebro.eth', 'cocoon.eth',
    'beautifulinwhite.eth', 'costly.eth', 'khori.eth', 'web3come.eth', 'web3cn.eth', 'brantly.eth', 'onose.eth'
  ];

  const profileSets = [
    {
      title: "Featured Profiles",
      profiles: ['smith.box', 'spyda.eth', 'zorida.eth'],
      type: 'featured'
    },
    {
      title: ".Box Community Members",
      profiles: [
        'ohms.box', 'black.box', 'hax.box', 'phantom.box', 'bing.box', 
        'hunter.box', 'mike.box', 'smith.box', 'blockchaineazy.box', 
        'stars.box', 'mystic.box', 'doom.box', 'seansky.box', 
        'onigiri.box', 'cypherpunk.box', 'yx.box', 'dude.box'
      ],
      type: 'grid'
    },
    {
      title: "EFP Leaderboard",
      profiles: efpLeaderboardProfiles,
      type: 'leaderboard'
    },
    {
      title: "10k ENS Club",
      profiles: generateEnsClubProfiles(ensClubPage),
      type: 'ensClub'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % profileSets.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + profileSets.length) % profileSets.length);
  };

  const loadMoreEnsProfiles = () => {
    if (ensClubPage * 20 < 999) {
      setEnsClubPage(prev => prev + 1);
    }
  };

  const loadPreviousEnsProfiles = () => {
    if (ensClubPage > 1) {
      setEnsClubPage(prev => prev - 1);
    }
  };

  const currentSet = profileSets[currentSlide];
  const isBoxCommunity = currentSlide === 1;
  const isEfpLeaderboard = currentSlide === 2;
  const isEnsClub = currentSlide === 3;
  const canLoadMore = isEnsClub && ensClubPage * 20 < 999;
  const canLoadPrevious = isEnsClub && ensClubPage > 1;

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
      
      {/* Profiles Grid */}
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
        ) : isEfpLeaderboard ? (
          /* Grid layout for EFP Leaderboard */
          <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 items-start max-w-6xl">
            {currentSet.profiles.map((profile, index) => (
              <div key={profile} className="flex justify-center">
                <HoneycombProfile ensName={profile} delay={index * 20} showName={true} />
              </div>
            ))}
          </div>
        ) : isEnsClub ? (
          /* Grid layout for ENS Club */
          <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 items-start max-w-5xl">
            {currentSet.profiles.map((profile, index) => (
              <div key={profile} className="flex justify-center">
                <HoneycombProfile ensName={profile} delay={index * 25} showName={true} />
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

      {/* Navigation buttons for ENS Club with black text */}
      {isEnsClub && (
        <div className="flex justify-center items-center gap-4 mb-4">
          {canLoadPrevious && (
            <Button
              onClick={loadPreviousEnsProfiles}
              variant="outline"
              className="border-slate-600 hover:bg-slate-800 text-black hover:text-black bg-white hover:bg-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          
          {canLoadMore && (
            <Button
              onClick={loadMoreEnsProfiles}
              variant="outline"
              className="border-slate-600 hover:bg-slate-800 text-black hover:text-black bg-white hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Next
            </Button>
          )}
        </div>
      )}

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
