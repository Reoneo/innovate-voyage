
import React from 'react';
import PoweredBySection from '@/components/PoweredBySection';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* This is a placeholder for the actual home page content */}
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-8">Recruitment.box</h1>
          <p className="text-xl text-center mb-8">A decentralized CV & recruitment engine powered by blockchain data.</p>
        </div>
      </main>
      <PoweredBySection />
    </div>
  );
};

export default Index;
