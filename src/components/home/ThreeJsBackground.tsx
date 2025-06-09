
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/contexts/ThemeContext';

const ThreeJsBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const { isDayMode } = useTheme();

  useEffect(() => {
    if (!mountRef.current) return;

    let scene: THREE.Scene | null = null;
    let renderer: THREE.WebGLRenderer | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let cubes: THREE.Mesh[] = [];

    const initThreeJS = () => {
      try {
        // Check WebGL support
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
          console.warn('WebGL not supported, falling back to CSS background');
          return false;
        }

        // Scene setup
        scene = new THREE.Scene();
        sceneRef.current = scene;
        
        // Set background color based on theme
        scene.background = new THREE.Color(isDayMode ? 0xffffff : 0x0f172a);

        camera = new THREE.PerspectiveCamera(
          75,
          window.innerWidth / window.innerHeight,
          0.1,
          1000
        );

        // Create renderer with error handling
        renderer = new THREE.WebGLRenderer({ 
          antialias: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false
        });
        
        rendererRef.current = renderer;
        
        // Add context lost/restore handlers
        const handleContextLost = (event: Event) => {
          event.preventDefault();
          console.log('WebGL context lost');
          if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
            animationIdRef.current = null;
          }
        };

        const handleContextRestore = () => {
          console.log('WebGL context restored');
          // Reinitialize the scene
          setTimeout(() => {
            initThreeJS();
          }, 100);
        };

        renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
        renderer.domElement.addEventListener('webglcontextrestored', handleContextRestore);

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        if (mountRef.current) {
          mountRef.current.appendChild(renderer.domElement);
        }

        // Create 1000 cubes
        cubes = [];
        const cubeGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        
        for (let i = 0; i < 1000; i++) {
          // Different materials for day/night mode
          const material = new THREE.MeshBasicMaterial({
            color: isDayMode 
              ? new THREE.Color().setHSL(Math.random(), 0.7, 0.6)  // Bright colors for day
              : new THREE.Color().setHSL(Math.random(), 0.7, 0.5), // Darker colors for night
            transparent: true,
            opacity: isDayMode ? 0.8 : 0.6
          });

          const cube = new THREE.Mesh(cubeGeometry, material);
          
          // Random positions
          cube.position.set(
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 50
          );
          
          // Random rotations
          cube.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
          );

          scene.add(cube);
          cubes.push(cube);
        }

        camera.position.z = 15;

        // Animation loop
        const animate = () => {
          if (!renderer || !scene || !camera) return;
          
          animationIdRef.current = requestAnimationFrame(animate);

          // Rotate cubes
          cubes.forEach((cube, index) => {
            cube.rotation.x += 0.005 + (index * 0.00001);
            cube.rotation.y += 0.005 + (index * 0.00001);
            
            // Gentle floating motion
            cube.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
          });

          // Camera movement
          camera.position.x = Math.sin(Date.now() * 0.0005) * 2;
          camera.position.y = Math.cos(Date.now() * 0.0003) * 1;
          camera.lookAt(0, 0, 0);

          try {
            renderer.render(scene, camera);
          } catch (error) {
            console.warn('Rendering error:', error);
            if (animationIdRef.current) {
              cancelAnimationFrame(animationIdRef.current);
              animationIdRef.current = null;
            }
          }
        };

        animate();

        // Handle resize
        const handleResize = () => {
          if (!camera || !renderer) return;
          
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return true;
      } catch (error) {
        console.warn('Failed to initialize Three.js:', error);
        return false;
      }
    };

    // Initialize Three.js
    const success = initThreeJS();
    
    // If Three.js fails, add a fallback CSS background
    if (!success && mountRef.current) {
      mountRef.current.style.background = isDayMode 
        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
    }

    return () => {
      // Cleanup
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }
      
      window.removeEventListener('resize', () => {});
      
      if (mountRef.current && renderer?.domElement) {
        try {
          mountRef.current.removeChild(renderer.domElement);
        } catch (error) {
          console.warn('Cleanup error:', error);
        }
      }
      
      if (renderer) {
        renderer.dispose();
      }
      
      // Dispose of geometries and materials
      cubes.forEach(cube => {
        if (cube.geometry) cube.geometry.dispose();
        if (cube.material) {
          if (Array.isArray(cube.material)) {
            cube.material.forEach(material => material.dispose());
          } else {
            cube.material.dispose();
          }
        }
      });
    };
  }, [isDayMode]);

  return <div ref={mountRef} className="absolute inset-0" />;
};

export default ThreeJsBackground;
