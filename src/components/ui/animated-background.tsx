
import React, { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  dominantColor: string | null;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ dominantColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Convert RGB color to HSL to create a nice color palette
  const rgbToHsl = (rgb: string | null): { h: number, s: number, l: number } => {
    if (!rgb) return { h: 250, s: 60, l: 70 }; // Default purple-ish
    
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return { h: 250, s: 60, l: 70 }; // Default if parse fails
    
    let r = parseInt(match[1]) / 255;
    let g = parseInt(match[2]) / 255;
    let b = parseInt(match[3]) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    let l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h *= 60;
    }
    
    return { h, s: s * 100, l: l * 100 };
  };
  
  // Create a color palette based on dominant color
  const createPalette = (baseColor: string | null) => {
    const hsl = rgbToHsl(baseColor);
    return {
      primary: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      lighter: `hsl(${hsl.h}, ${Math.min(hsl.s + 10, 100)}%, ${Math.min(hsl.l + 15, 90)}%)`,
      darker: `hsl(${hsl.h}, ${Math.min(hsl.s + 15, 100)}%, ${Math.max(hsl.l - 15, 25)}%)`,
      accent: `hsl(${(hsl.h + 180) % 360}, ${hsl.s}%, ${hsl.l}%)`,
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const palette = createPalette(dominantColor);
    
    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Create gradient blobs
    class Blob {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
      opacity: number;

      constructor(color: string) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 300 + 100;
        this.color = color;
        this.vx = Math.random() * 0.2 - 0.1;
        this.vy = Math.random() * 0.2 - 0.1;
        this.opacity = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.x > canvas.width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = canvas.height + this.radius;
        if (this.y > canvas.height + this.radius) this.y = -this.radius;
      }

      draw() {
        ctx!.beginPath();
        const gradient = ctx!.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        );
        gradient.addColorStop(0, `${this.color}${Math.floor(this.opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${this.color}00`);
        ctx!.fillStyle = gradient;
        ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    // Create blobs
    const blobs: Blob[] = [];
    blobs.push(new Blob(palette.primary));
    blobs.push(new Blob(palette.lighter));
    blobs.push(new Blob(palette.darker));
    blobs.push(new Blob(palette.accent));
    blobs.push(new Blob(palette.primary));

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw blobs
      blobs.forEach(blob => {
        blob.update();
        blob.draw();
      });
      
      // Add subtle noise overlay
      const noiseData = ctx.createImageData(canvas.width, canvas.height);
      const noiseBuffer = new Uint32Array(noiseData.data.buffer);
      
      for (let i = 0; i < noiseBuffer.length; i++) {
        if (Math.random() > 0.995) {
          noiseBuffer[i] = 0x05000000; // Very subtle noise
        }
      }
      
      ctx.putImageData(noiseData, 0, 0);
      
      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    // Clean up
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [dominantColor]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed top-0 left-0 w-full h-full -z-10" 
      style={{ 
        pointerEvents: 'none',
        opacity: 0.8
      }}
    />
  );
};

export default AnimatedBackground;
