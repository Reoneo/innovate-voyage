
import { useState, useEffect } from 'react';
import ColorThief from 'colorthief';

interface ThemeColors {
  primary: string;
  primaryHover: string;
  secondary: string;
  secondaryHover: string;
}

const defaultThemeColors: ThemeColors = {
  primary: '#7856FF',
  primaryHover: '#6B46C1',
  secondary: '#E5E7EB',
  secondaryHover: '#9CA3AF'
};

export const usePoapTheme = (userAvatarUrl?: string): ThemeColors => {
  const [themeColors, setThemeColors] = useState<ThemeColors>(defaultThemeColors);

  useEffect(() => {
    const extractThemeColors = async () => {
      if (!userAvatarUrl) {
        setThemeColors(defaultThemeColors);
        return;
      }
      
      try {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        
        img.onload = () => {
          try {
            const colorThief = new ColorThief();
            const dominantColor = colorThief.getColor(img);
            const palette = colorThief.getPalette(img, 3);
            
            if (dominantColor && palette) {
              const primaryRgb = dominantColor;
              const secondaryRgb = palette[1] || palette[0];
              
              const rgbToHex = (r: number, g: number, b: number) => 
                `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
              
              const darkenColor = (rgb: [number, number, number], factor = 0.8): [number, number, number] => 
                [Math.floor(rgb[0] * factor), Math.floor(rgb[1] * factor), Math.floor(rgb[2] * factor)];
              
              const primary = rgbToHex(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
              const darkenedPrimaryRgb = darkenColor(primaryRgb, 0.9);
              const primaryHover = rgbToHex(darkenedPrimaryRgb[0], darkenedPrimaryRgb[1], darkenedPrimaryRgb[2]);
              
              const secondary = rgbToHex(secondaryRgb[0], secondaryRgb[1], secondaryRgb[2]);
              const darkenedSecondaryRgb = darkenColor(secondaryRgb, 0.9);
              const secondaryHover = rgbToHex(darkenedSecondaryRgb[0], darkenedSecondaryRgb[1], darkenedSecondaryRgb[2]);
              
              setThemeColors({
                primary,
                primaryHover,
                secondary,
                secondaryHover
              });
            } else {
              setThemeColors(defaultThemeColors);
            }
          } catch (error) {
            console.error('Error extracting colors from avatar:', error);
            setThemeColors(defaultThemeColors);
          }
        };
        
        img.onerror = () => {
          console.error('Error loading avatar image for color extraction.');
          setThemeColors(defaultThemeColors);
        };
        
        img.src = userAvatarUrl;
      } catch (error) {
        console.error('Error preparing avatar for color extraction:', error);
        setThemeColors(defaultThemeColors);
      }
    };

    extractThemeColors();
  }, [userAvatarUrl]);

  return themeColors;
};

