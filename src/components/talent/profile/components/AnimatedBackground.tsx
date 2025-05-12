
import React from 'react';
import { useEffect, useState } from 'react';

interface AnimatedBackgroundProps {
  avatarUrl?: string;
  isLoading?: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ avatarUrl, isLoading = false }) => {
  const [loaded, setLoaded] = useState(false);
  const [dominantColor, setDominantColor] = useState<string | null>(null);

  useEffect(() => {
    if (avatarUrl && !isLoading) {
      // Create an in-memory canvas to analyze the image
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = avatarUrl;
      
      img.onload = () => {
        try {
          // Simple dominant color extraction
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, img.width, img.height);
            
            // Get pixel data from the center of the image
            const centerX = Math.floor(img.width / 2);
            const centerY = Math.floor(img.height / 2);
            const pixelData = ctx.getImageData(centerX, centerY, 1, 1).data;
            
            // Use the pixel color with reduced opacity
            const color = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, 0.08)`;
            setDominantColor(color);
          }
        } catch (error) {
          console.error('Error extracting color from avatar:', error);
          // Fallback to default color
          setDominantColor('rgba(79, 70, 229, 0.1)');
        }
        setLoaded(true);
      };
      
      img.onerror = () => {
        console.error('Error loading avatar for color extraction');
        setDominantColor('rgba(79, 70, 229, 0.1)');
        setLoaded(true);
      };
    } else {
      // Default color for loading or no avatar
      setDominantColor('rgba(79, 70, 229, 0.1)');
      setLoaded(true);
    }
  }, [avatarUrl, isLoading]);

  if (!loaded) {
    return <div className="fixed inset-0 bg-white" />;
  }

  const baseColor = dominantColor || 'rgba(79, 70, 229, 0.1)';

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-white">
      {/* Main gradient background with animation */}
      <div 
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${baseColor} 0%, rgba(255, 255, 255, 0) 70%)`,
          animation: 'pulse 15s infinite alternate'
        }}
      />
      
      {/* Animated floating blobs in the background */}
      <div 
        className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle at center, ${baseColor} 0%, rgba(255, 255, 255, 0) 70%)`,
          animation: 'float 20s infinite alternate ease-in-out'
        }}
      />
      
      <div 
        className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full opacity-15"
        style={{
          background: `radial-gradient(circle at center, ${baseColor} 0%, rgba(255, 255, 255, 0) 70%)`,
          animation: 'float 25s infinite alternate-reverse ease-in-out'
        }}
      />
      
      {/* Dynamic mesh grid pattern for texture */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(0, 0, 0, 0.3) 25%, rgba(0, 0, 0, 0.3) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, 0.3) 75%, rgba(0, 0, 0, 0.3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 0, 0, 0.3) 25%, rgba(0, 0, 0, 0.3) 26%, transparent 27%, transparent 74%, rgba(0, 0, 0, 0.3) 75%, rgba(0, 0, 0, 0.3) 76%, transparent 77%, transparent)',
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
            transform: translate(0, 0);
          }
          50% {
            transform: translate(5%, 5%);
          }
          100% {
            transform: translate(-5%, -5%);
          }
        }
      `}
      </style>
    </div>
  );
};

export default AnimatedBackground;
