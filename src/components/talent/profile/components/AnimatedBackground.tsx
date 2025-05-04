
import React, { useEffect, useState } from 'react';
import { avatarCache } from '@/api/utils/web3/avatarCache';
import ColorThief from 'colorthief';

interface AnimatedBackgroundProps {
  avatarUrl?: string;
  isLoading?: boolean;
}

// Function to generate a fallback gradient
const getFallbackGradient = () => {
  const gradients = [
    'linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%)',
    'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
    'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ avatarUrl, isLoading = false }) => {
  const [gradient, setGradient] = useState<string>(getFallbackGradient());

  useEffect(() => {
    const extractColors = async () => {
      if (!avatarUrl || isLoading) return;
      
      try {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        
        img.onload = () => {
          try {
            const colorThief = new ColorThief();
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            if (!context) return;
            
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
            
            // Get the dominant color and a palette
            const dominantColor = colorThief.getColor(img);
            const palette = colorThief.getPalette(img, 3);
            
            if (dominantColor && palette) {
              // Create a gradient from the extracted colors
              const color1 = `rgb(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]})`;
              const color2 = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
              const color3 = palette[1] ? `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})` : color1;
              
              setGradient(`linear-gradient(135deg, ${color1} 0%, ${color2} 50%, ${color3} 100%)`);
            }
          } catch (error) {
            console.error('Error extracting colors:', error);
            setGradient(getFallbackGradient());
          }
        };
        
        img.onerror = () => {
          console.error('Error loading image for color extraction');
          setGradient(getFallbackGradient());
        };
        
        img.src = avatarUrl;
      } catch (error) {
        console.error('Error in color extraction process:', error);
        setGradient(getFallbackGradient());
      }
    };

    extractColors();
  }, [avatarUrl, isLoading]);

  return (
    <div
      className="absolute inset-0 -z-10 overflow-hidden transition-all duration-700"
      style={{
        background: isLoading ? '#FFFFFF' : gradient,
        backgroundSize: '400% 400%',
        animation: isLoading ? 'none' : 'gradient-animation 15s ease infinite',
      }}
    >
      {/* Animated overlay patterns - only show when not loading */}
      {!isLoading && (
        <>
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0,transparent_70%)]"></div>
          </div>
          
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-10" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          ></div>
        </>
      )}
    </div>
  );
};

export default AnimatedBackground;
