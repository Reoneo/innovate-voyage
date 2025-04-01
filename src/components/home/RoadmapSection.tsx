
import React from 'react';

const RoadmapSection: React.FC = () => {
  return (
    <div className="py-16 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Roadmap</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="border border-muted rounded-lg p-6 bg-card">
            <div className="flex items-center mb-3">
              <span className="bg-primary/10 text-primary font-medium rounded-full h-7 w-7 flex items-center justify-center mr-3">1</span>
              <h3 className="text-xl font-semibold">Auto-Generated CVs</h3>
            </div>
            <p className="text-muted-foreground pl-10">
              Automatically generate comprehensive professional profiles from verified blockchain records and on-chain activity.
              <span className="inline-flex items-center ml-2 text-xs font-medium text-primary">In Development</span>
            </p>
          </div>
          
          <div className="border border-muted rounded-lg p-6 bg-card">
            <div className="flex items-center mb-3">
              <span className="bg-primary/10 text-primary font-medium rounded-full h-7 w-7 flex items-center justify-center mr-3">2</span>
              <h3 className="text-xl font-semibold">Blockchain ID Integration</h3>
            </div>
            <p className="text-muted-foreground pl-10">
              Comprehensive integration with all major blockchain identity services for a unified professional presence across Web3.
            </p>
          </div>
          
          <div className="border border-muted rounded-lg p-6 bg-card">
            <div className="flex items-center mb-3">
              <span className="bg-primary/10 text-primary font-medium rounded-full h-7 w-7 flex items-center justify-center mr-3">3</span>
              <h3 className="text-xl font-semibold">AI Candidate-Job Matching</h3>
            </div>
            <p className="text-muted-foreground pl-10">
              Advanced AI algorithms to match candidates with optimal job opportunities based on verified skills and experience.
            </p>
          </div>
          
          <div className="border border-muted rounded-lg p-6 bg-card">
            <div className="flex items-center mb-3">
              <span className="bg-primary/10 text-primary font-medium rounded-full h-7 w-7 flex items-center justify-center mr-3">4</span>
              <h3 className="text-xl font-semibold">Future Developments</h3>
            </div>
            <p className="text-muted-foreground pl-10">
              Additional features and platform enhancements to be announced based on community feedback and evolving industry needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapSection;
