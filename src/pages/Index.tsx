
import React from 'react';
import HeroSection from '@/components/home/HeroSection';
import ActionButtonsSection from '@/components/home/ActionButtonsSection';
import Footer from '@/components/home/Footer';
import JobsPopup from '@/components/jobs/JobsPopup';

const Index: React.FC = () => {
  console.log("Index page rendering");
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <HeroSection />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <JobsPopup />
        </div>
      </div>
      
      <ActionButtonsSection />
      <Footer />
    </div>
  );
};

export default Index;
