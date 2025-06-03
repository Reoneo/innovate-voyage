import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import HoneycombProfile from './HoneycombProfile';
const FeaturedProfileSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [ensClubPage, setEnsClubPage] = useState(1);
  const [efpPage, setEfpPage] = useState(1);
  const generateEnsClubProfiles = (page: number) => {
    const startNum = (page - 1) * 20 + 1;
    const endNum = Math.min(page * 20, 999);
    return Array.from({
      length: endNum - startNum + 1
    }, (_, i) => {
      const num = startNum + i;
      return `${num.toString().padStart(3, '0')}.eth`;
    });
  };
  const allEfpLeaderboardProfiles = ['sargent.eth', '👁️‍🗨️.eth', '2️⃣2️⃣.eth', '🐈‍⬛.eth', 'shannon1.eth', 'mmmm.eth', 'going.eth', 'followmeme.eth', 'furyan.eth', '0xthrpw.eth', 'okarun.eth', 'autist.eth', '👨‍🎤.eth', 'didierkrux.eth', 'deadstock.eth', '🤵🏼‍♂️.eth', 'slowsort.eth', 'brianarmstrong.eth', 'art.mely.eth', 'bullieverisland.eth', 'efp.encrypteddegen.eth', 'broke.eth', 'heardle.eth', 'planetos.eth', 'ittalik.eth', '👩🏿‍🦲.eth', 'cryptodon.eth', 'dons.eth', 'captaintoken.eth', 'bobzerah.eth', '👩🏻‍🎤.eth', 'tchiktchak.eth', 'yoyodyne.eth', 'poldo.eth', 'odie.eth', 'ohhkaneda.eth', 'wbush.eth', 'utd.eth', '🧝🏻‍♀️.eth', 'apostolos.eth', 'pawswap.eth', 'huncho.eth', 'tostada.eth', 'madeintheusa.eth', '2021go.eth', '4444.eth', 'lagovskii333.eth', 'grado.eth', 'encrypteddegen.eth', 'web3go.eth', 'cordaro.eth', 'spacebro.eth', 'cocoon.eth', 'beautifulinwhite.eth', 'costly.eth', 'khori.eth', 'web3come.eth', 'web3cn.eth', 'brantly.eth', 'onose.eth'];
  const getEfpLeaderboardProfiles = (page: number) => {
    const startIndex = (page - 1) * 20;
    const endIndex = Math.min(startIndex + 20, allEfpLeaderboardProfiles.length);
    return allEfpLeaderboardProfiles.slice(startIndex, endIndex);
  };
  const profileSets = [{
    title: "Featured",
    profiles: ['smith.box', 'spyda.eth', 'zorida.eth', 'web3.bio'],
    type: 'featured'
  }, {
    title: ".Box Community Members",
    profiles: ['ohms.box', 'black.box', 'hax.box', 'phantom.box', 'bing.box', 'hunter.box', 'mike.box', 'smith.box', 'blockchaineazy.box', 'stars.box', 'mystic.box', 'doom.box', 'seansky.box', 'onigiri.box', 'cypherpunk.box', 'yx.box', 'dude.box'],
    type: 'grid'
  }, {
    title: "EFP Leaderboard",
    profiles: getEfpLeaderboardProfiles(efpPage),
    type: 'leaderboard'
  }, {
    title: "10k ENS Club",
    profiles: generateEnsClubProfiles(ensClubPage),
    type: 'ensClub'
  }];
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % profileSets.length);
  };
  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + profileSets.length) % profileSets.length);
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
  const loadMoreEfpProfiles = () => {
    if (efpPage * 20 < allEfpLeaderboardProfiles.length) {
      setEfpPage(prev => prev + 1);
    }
  };
  const loadPreviousEfpProfiles = () => {
    if (efpPage > 1) {
      setEfpPage(prev => prev - 1);
    }
  };
  const currentSet = profileSets[currentSlide];
  const isBoxCommunity = currentSlide === 1;
  const isEfpLeaderboard = currentSlide === 2;
  const isEnsClub = currentSlide === 3;
  const canLoadMore = isEnsClub && ensClubPage * 20 < 999;
  const canLoadPrevious = isEnsClub && ensClubPage > 1;
  const canLoadMoreEfp = isEfpLeaderboard && efpPage * 20 < allEfpLeaderboardProfiles.length;
  const canLoadPreviousEfp = isEfpLeaderboard && efpPage > 1;
  return <div className="max-w-4xl mx-auto h-auto">
      <div className="flex items-center justify-center mb-4 relative py-[7px]">
        <Button variant="ghost" size="icon" onClick={prevSlide} className="absolute left-0 h-10 w-10 text-white hover:text-white hover:bg-slate-600/80 bg-slate-700/60 border border-slate-500/50 rounded-full shadow-lg backdrop-blur-sm">
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <h3 className="text-lg font-semibold text-white text-center">
          Browse Profiles
        </h3>
        
        <Button variant="ghost" size="icon" onClick={nextSlide} className="absolute right-0 h-10 w-10 text-white hover:text-white hover:bg-slate-600/80 bg-slate-700/60 border border-slate-500/50 rounded-full shadow-lg backdrop-blur-sm">
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <h4 className="text-xl font-bold text-white mb-6 text-center bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
        {currentSet.title}
      </h4>
      
      {/* Profiles Grid - Allow scrolling */}
      <div className="relative flex justify-center items-center mb-8 h-auto">
        {isBoxCommunity ? (/* Grid layout for Box Community Members */
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-start max-w-4xl">
            {currentSet.profiles.map((profile, index) => <div key={profile} className="flex justify-center">
                <HoneycombProfile ensName={profile} delay={index * 50} showName={true} />
              </div>)}
          </div>) : isEfpLeaderboard ? (/* Grid layout for EFP Leaderboard */
      <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 items-start max-w-6xl">
            {currentSet.profiles.map((profile, index) => <div key={profile} className="flex justify-center">
                <HoneycombProfile ensName={profile} delay={index * 20} showName={true} />
              </div>)}
          </div>) : isEnsClub ? (/* Grid layout for ENS Club */
      <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 items-start max-w-5xl">
            {currentSet.profiles.map((profile, index) => <div key={profile} className="flex justify-center">
                <HoneycombProfile ensName={profile} delay={index * 25} showName={true} />
              </div>)}
          </div>) : (/* Grid layout for Featured Profiles */
      <div className="grid grid-cols-2 gap-6 items-start">
            {currentSet.profiles.map((profile, index) => <div key={profile} className="flex justify-center">
                <HoneycombProfile ensName={profile} delay={index * 200} showName={true} />
              </div>)}
          </div>)}
      </div>

      {/* Navigation buttons for EFP Leaderboard with black text */}
      {isEfpLeaderboard && <div className="flex justify-center items-center gap-4 mb-4">
          {canLoadPreviousEfp && <Button onClick={loadPreviousEfpProfiles} variant="outline" className="border-slate-600 hover:bg-slate-800 text-black hover:text-black bg-white hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>}
          
          {canLoadMoreEfp && <Button onClick={loadMoreEfpProfiles} variant="outline" className="border-slate-600 hover:bg-slate-800 text-black hover:text-black bg-white hover:bg-gray-100">
              <Plus className="h-4 w-4 mr-2" />
              Next
            </Button>}
        </div>}

      {/* Navigation buttons for ENS Club with black text */}
      {isEnsClub && <div className="flex justify-center items-center gap-4 mb-4">
          {canLoadPrevious && <Button onClick={loadPreviousEnsProfiles} variant="outline" className="border-slate-600 hover:bg-slate-800 text-black hover:text-black bg-white hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>}
          
          {canLoadMore && <Button onClick={loadMoreEnsProfiles} variant="outline" className="border-slate-600 hover:bg-slate-800 text-black hover:text-black bg-white hover:bg-gray-100">
              <Plus className="h-4 w-4 mr-2" />
              Next
            </Button>}
        </div>}

      {/* Slide indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {profileSets.map((_, index) => <button key={index} onClick={() => setCurrentSlide(index)} className={`w-2 h-2 rounded-full transition-colors duration-200 ${index === currentSlide ? 'bg-blue-400' : 'bg-slate-600'}`} />)}
      </div>
    </div>;
};
export default FeaturedProfileSection;