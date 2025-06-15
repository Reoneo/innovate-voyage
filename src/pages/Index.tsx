import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import ActionButtonsSection from '@/components/home/ActionButtonsSection';
import TalentShowcaseSection from '@/components/home/TalentShowcaseSection';
import WhyJoinSection from '@/components/home/WhyJoinSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import Footer from '@/components/home/Footer';
import JobsPopup from '@/components/jobs/JobsPopup';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <JobsPopup />
        </div>
        
      </div>
      <ActionButtonsSection />
      <TalentShowcaseSection />
      <WhyJoinSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
