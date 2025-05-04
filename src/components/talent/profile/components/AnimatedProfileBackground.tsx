
import React, { useEffect, useState } from 'react';
import { useAvatarColors } from '@/hooks/useAvatarColors';

interface AnimatedProfileBackgroundProps {
  avatarUrl?: string;
  children: React.ReactNode;
}

const AnimatedProfileBackground: React.FC<AnimatedProfileBackgroundProps> = ({ 
  avatarUrl, 
  children 
}) => {
  const { colors } = useAvatarColors(avatarUrl);
  const [gradientStyle, setGradientStyle] = useState<React.CSSProperties>({});
  const [angle, setAngle] = useState(0);
  
  // Generate gradient CSS based on extracted colors
  useEffect(() => {
    const animateGradient = () => {
      setAngle((prevAngle) => (prevAngle + 0.2) % 360);
    };
    
    // Create animation interval
    const intervalId = setInterval(animateGradient, 50);
    
    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Update gradient style when colors or angle changes
  useEffect(() => {
    if (colors.length >= 2) {
      const gradientColors = colors.join(', ');
      setGradientStyle({
        background: `linear-gradient(${angle}deg, ${gradientColors})`,
        transition: 'background 0.5s ease',
      });
    }
  }, [colors, angle]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 z-0 blur-2xl opacity-30"
        style={gradientStyle}
      />
      
      {/* Content with glassmorphism effect */}
      <div className="relative z-10 min-h-screen bg-transparent">
        {children}
      </div>
    </div>
  );
};

export default AnimatedProfileBackground;
