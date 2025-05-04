
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { handleLinkedInCallback } from '@/api/services/linkedinService';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LinkedInCallback = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Extract code and state from URL
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        const state = params.get('state');
        
        if (!code || !state) {
          throw new Error('Missing required parameters');
        }
        
        const success = await handleLinkedInCallback(code, state);
        
        if (success) {
          setStatus('success');
          toast({
            title: "LinkedIn Connected",
            description: "Successfully connected to LinkedIn",
          });
          
          // Close this window after a short delay if it's a popup
          setTimeout(() => {
            if (window.opener) {
              window.opener.postMessage({ type: 'LINKEDIN_AUTH_SUCCESS' }, window.location.origin);
              window.close();
            } else {
              // Navigate back to profile if not a popup
              const returnPath = localStorage.getItem('linkedin_return_path') || '/';
              navigate(returnPath);
            }
          }, 1500);
        } else {
          setStatus('error');
          toast({
            title: "LinkedIn Error",
            description: "Failed to connect to LinkedIn",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error handling LinkedIn callback:', error);
        setStatus('error');
        toast({
          title: "Authentication Error",
          description: "Something went wrong during LinkedIn authentication",
          variant: "destructive"
        });
      }
    };
    
    processCallback();
  }, [location, navigate, toast]);
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-xl shadow-lg">
        <div className="flex items-center justify-center">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" 
            alt="LinkedIn" 
            className="w-12 h-12"
          />
        </div>
        
        <h1 className="text-2xl font-bold text-center">
          LinkedIn Authentication
        </h1>
        
        {status === 'processing' && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            <p className="text-gray-600 text-center">
              Processing your LinkedIn authentication...
            </p>
          </div>
        )}
        
        {status === 'success' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-600 text-center">
              Successfully connected! Redirecting...
            </p>
          </div>
        )}
        
        {status === 'error' && (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-gray-600 text-center">
              There was an error connecting to LinkedIn.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LinkedInCallback;
