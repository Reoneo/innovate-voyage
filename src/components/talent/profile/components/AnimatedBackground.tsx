
import React, { useEffect, useState } from 'react';
import ColorThief from 'colorthief';

interface AnimatedBackgroundProps {
  avatarUrl?: string;
  isLoading?: boolean;
}

// Function to generate a fallback gradient
const getFallbackGradient = () => {
  const gradients = [
    'linear-gradient(135deg, #f6d5b5 0%, #4C6EF5 40%, #ff7f7f 70%, #e6e6e6 100%)',
    'linear-gradient(135deg, #f9f3e7 0%, #ffb78b 30%, #4C6EF5 60%, #ff958c 100%)',
    'linear-gradient(135deg, #f1eee3 0%, #ff9f80 25%, #7693ff 50%, #ff9f9f 75%, #dadada 100%)',
    'linear-gradient(135deg, #f6f6f6 0%, #ffa07a 35%, #4C6EF5 65%, #ff8c69 100%)'
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ avatarUrl, isLoading = false }) => {
  const [gradient, setGradient] = useState<string>(getFallbackGradient());

  useEffect(() => {
    const extractColors = async () => {
      if (!avatarUrl) return;
      
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
            const palette = colorThief.getPalette(img, 6); // Get more colors for variety
            
            if (dominantColor && palette) {
              // Create a more dynamic and sophisticated gradient from the extracted colors
              // Mix in some predefined colors like Ethereum blue
              const ethereumBlue = '76, 110, 245'; // #4C6EF5
              
              // Extract palette colors
              const color1 = `rgb(${palette[0][0]}, ${palette[0][1]}, ${palette[0][2]})`;
              const color2 = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
              const color3 = palette[1] ? `rgb(${palette[1][0]}, ${palette[1][1]}, ${palette[1][2]})` : color1;
              const color4 = `rgb(${ethereumBlue})`;
              const color5 = palette[2] ? `rgb(${palette[2][0]}, ${palette[2][1]}, ${palette[2][2]})` : color2;
              
              // Create an enhanced radial + linear combination gradient
              const enhancedGradient = `
                radial-gradient(circle at top left, ${color1}22, transparent 50%), 
                radial-gradient(circle at bottom right, ${color3}33, transparent 60%), 
                linear-gradient(135deg, ${color1} 0%, ${color2} 25%, ${color4} 50%, ${color5} 75%, ${color3} 100%)
              `;
              
              setGradient(enhancedGradient);
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
  }, [avatarUrl]);

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden transition-all duration-1000"
      style={{
        background: gradient,
        backgroundSize: '400% 400%',
        animation: 'gradient-animation 20s ease infinite',
      }}
    >
      {/* Enhanced overlay patterns with depth */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_0,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12)_0,transparent_60%)]"></div>
      </div>
      
      {/* Enhanced noise texture overlay */}
      <div className="absolute inset-0 opacity-8" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      ></div>
    </div>
  );
};

export default AnimatedBackground;
