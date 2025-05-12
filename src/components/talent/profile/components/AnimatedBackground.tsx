
import React from 'react';
import { useEffect, useState } from 'react';

interface AnimatedBackgroundProps {
  avatarUrl?: string;
  isLoading?: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ avatarUrl, isLoading = false }) => {
  const [loaded, setLoaded] = useState(false);
  const [dominantColor, setDominantColor] = useState<string | null>(null);
  const [secondaryColor, setSecondaryColor] = useState<string | null>(null);

  useEffect(() => {
    if (avatarUrl && !isLoading) {
      // Create an in-memory canvas to analyze the image
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = avatarUrl;
      
      img.onload = () => {
        try {
          // Extract colors from the image
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, img.width, img.height);
            
            // Get pixel data from different parts of the image
            const centerX = Math.floor(img.width / 2);
            const centerY = Math.floor(img.height / 2);
            const centerPixel = ctx.getImageData(centerX, centerY, 1, 1).data;
            
            const topLeftX = Math.floor(img.width / 4);
            const topLeftY = Math.floor(img.height / 4);
            const topLeftPixel = ctx.getImageData(topLeftX, topLeftY, 1, 1).data;
            
            // Use the pixel colors with reduced opacity
            const mainColor = `rgba(${centerPixel[0]}, ${centerPixel[1]}, ${centerPixel[2]}, 0.12)`;
            const secondColor = `rgba(${topLeftPixel[0]}, ${topLeftPixel[1]}, ${topLeftPixel[2]}, 0.10)`;
            
            setDominantColor(mainColor);
            setSecondaryColor(secondColor);
          }
        } catch (error) {
          console.error('Error extracting color from avatar:', error);
          // Fallback to default colors
          setDominantColor('rgba(79, 70, 229, 0.1)');
          setSecondaryColor('rgba(124, 58, 237, 0.08)');
        }
        setLoaded(true);
      };
      
      img.onerror = () => {
        console.error('Error loading avatar for color extraction');
        setDominantColor('rgba(79, 70, 229, 0.1)');
        setSecondaryColor('rgba(124, 58, 237, 0.08)');
        setLoaded(true);
      };
    } else {
      // Default colors for loading or no avatar
      setDominantColor('rgba(79, 70, 229, 0.1)');
      setSecondaryColor('rgba(124, 58, 237, 0.08)');
      setLoaded(true);
    }
  }, [avatarUrl, isLoading]);

  if (!loaded) {
    return <div className="fixed inset-0 bg-white" />;
  }

  const baseColor = dominantColor || 'rgba(79, 70, 229, 0.1)';
  const accentColor = secondaryColor || 'rgba(124, 58, 237, 0.08)';

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-white">
      {/* Main gradient background with enhanced animation */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${baseColor} 0%, rgba(255, 255, 255, 0) 70%)`,
          animation: 'pulse 15s infinite alternate'
        }}
      />
      
      {/* Enhanced animated floating blobs in the background */}
      <div 
        className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full opacity-20 blur-xl"
        style={{
          background: `radial-gradient(circle at center, ${baseColor} 0%, rgba(255, 255, 255, 0) 70%)`,
          animation: 'float 20s infinite alternate ease-in-out'
        }}
      />
      
      <div 
        className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full opacity-15 blur-xl"
        style={{
          background: `radial-gradient(circle at center, ${accentColor} 0%, rgba(255, 255, 255, 0) 70%)`,
          animation: 'float 25s infinite alternate-reverse ease-in-out'
        }}
      />
      
      {/* Additional floating elements for more visual interest */}
      <div 
        className="absolute top-[10%] right-[20%] w-[40%] h-[40%] rounded-full opacity-10 blur-lg"
        style={{
          background: `radial-gradient(circle at center, ${baseColor} 0%, rgba(255, 255, 255, 0) 70%)`,
          animation: 'floatSlow 30s infinite alternate ease-in-out'
        }}
      />
      
      <div 
        className="absolute bottom-[30%] left-[25%] w-[30%] h-[30%] rounded-full opacity-10 blur-lg"
        style={{
          background: `radial-gradient(circle at center, ${accentColor} 0%, rgba(255, 255, 255, 0) 70%)`,
          animation: 'floatSlow 35s infinite alternate-reverse ease-in-out'
        }}
      />
      
      {/* Dynamic mesh grid pattern for texture with reduced opacity */}
      <div 
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 0, 0, 0.2) 25%, rgba(0, 0, 0, 0.2) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, 0.2) 75%, rgba(0, 0, 0, 0.2) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 0, 0, 0.2) 25%, rgba(0, 0, 0, 0.2) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, 0.2) 75%, rgba(0, 0, 0, 0.2) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }}
      />
      
      {/* Add some custom animation styles */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 0.9;
              transform: scale(1);
            }
            50% {
              opacity: 0.5;
              transform: scale(1.05);
            }
          }
          
          @keyframes float {
            0% {
              transform: translate(0, 0) rotate(0deg);
            }
            33% {
              transform: translate(3%, 3%) rotate(2deg);
            }
            66% {
              transform: translate(-3%, 5%) rotate(-2deg);
            }
            100% {
              transform: translate(-5%, -3%) rotate(1deg);
            }
          }
          
          @keyframes floatSlow {
            0% {
              transform: translate(0, 0) rotate(0deg);
            }
            25% {
              transform: translate(2%, 2%) rotate(1deg);
            }
            50% {
              transform: translate(-2%, 4%) rotate(-1deg);
            }
            75% {
              transform: translate(-4%, -2%) rotate(2deg);
            }
            100% {
              transform: translate(4%, -4%) rotate(-2deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default AnimatedBackground;
