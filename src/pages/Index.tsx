
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '@/components/home/HeroSection';
import SearchSection from '@/components/home/SearchSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import PoweredBySection from '@/components/home/PoweredBySection';
import Footer from '@/components/home/Footer';

const Index = () => {
  useEffect(() => {
    console.log('Index: Home page mounted');
  }, []);

  try {
    console.log('Index: Rendering home page');
    
    return (
      <>
        <Helmet>
          <title>Recruitment.box - Web3 Talent Discovery Platform</title>
          <meta name="description" content="Discover and showcase Web3 talent through comprehensive blockchain profiles, GitHub contributions, and professional credentials." />
        </Helmet>
        
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
          <HeroSection />
          <SearchSection />
          <FeaturesSection />
          <PoweredBySection />
          <Footer />
        </div>
      </>
    );
  } catch (error) {
    console.error('Index: Render error:', error);
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'sans-serif',
        background: '#f8d7da',
        color: '#721c24'
      }}>
        <h2>Home Page Error</h2>
        <p>{error instanceof Error ? error.message : 'Unknown error loading home page'}</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }
};

export default Index;
