
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

// Import pages
import TalentProfile from './pages/TalentProfile';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

// Import components
import { Toaster } from '@/components/ui/sonner';
import LinkedInCallback from './components/linkedin/LinkedInCallback';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/linkedin-callback" element={<LinkedInCallback />} />
          <Route path="/:ensNameOrAddress" element={<TalentProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="bottom-right" />
      </BrowserRouter>
    </div>
  );
}

export default App;
