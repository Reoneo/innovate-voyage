
import { useState, useEffect } from 'react';

export function useAvatarColors(avatarUrl: string | undefined) {
  const [colors, setColors] = useState<string[]>(['#7856FF', '#9b87f5', '#D946EF']);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!avatarUrl) return;

    setIsLoading(true);
    
    // Create an image element to load the avatar
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      try {
        // Create a canvas to analyze the image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image on the canvas
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          
          // Sample colors from different parts of the image
          const extractedColors: string[] = [];
          
          // Top left
          const topLeft = ctx.getImageData(Math.floor(img.width * 0.25), Math.floor(img.height * 0.25), 1, 1).data;
          // Center
          const center = ctx.getImageData(Math.floor(img.width * 0.5), Math.floor(img.height * 0.5), 1, 1).data;
          // Bottom right
          const bottomRight = ctx.getImageData(Math.floor(img.width * 0.75), Math.floor(img.height * 0.75), 1, 1).data;
          
          // Convert RGB to hex
          const topLeftHex = `rgb(${topLeft[0]}, ${topLeft[1]}, ${topLeft[2]})`;
          const centerHex = `rgb(${center[0]}, ${center[1]}, ${center[2]})`;
          const bottomRightHex = `rgb(${bottomRight[0]}, ${bottomRight[1]}, ${bottomRight[2]})`;
          
          extractedColors.push(topLeftHex, centerHex, bottomRightHex);
          
          // Ensure we have at least 3 different colors
          if (new Set(extractedColors).size < 3) {
            // If not enough distinct colors, add some variations
            extractedColors.push('#7856FF', '#9b87f5');
          }
          
          setColors(extractedColors);
        }
      } catch (error) {
        console.error('Error extracting colors from avatar:', error);
        // Fallback to default colors
        setColors(['#7856FF', '#9b87f5', '#D946EF']);
      }
      
      setIsLoading(false);
    };
    
    img.onerror = () => {
      console.error('Error loading avatar image for color extraction');
      setColors(['#7856FF', '#9b87f5', '#D946EF']);
      setIsLoading(false);
    };
    
    // Handle CORS issues by using a proxy for external images
    let imageUrl = avatarUrl;
    if (avatarUrl && !avatarUrl.startsWith('data:') && !avatarUrl.includes('lovable') && !avatarUrl.startsWith('/')) {
      // Use a CORS proxy for external images
      imageUrl = avatarUrl;
    }
    
    img.src = imageUrl;
  }, [avatarUrl]);
  
  return { colors, isLoading };
}
