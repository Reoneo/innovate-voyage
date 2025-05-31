
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/contexts/ThemeContext';

const ThreeJsBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const { isDayMode } = useTheme();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    // Set background color based on theme
    scene.background = new THREE.Color(isDayMode ? 0xffffff : 0x0f172a);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    mountRef.current.appendChild(renderer.domElement);

    // Create 1000 cubes
    const cubes: THREE.Mesh[] = [];
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
      requestAnimationFrame(animate);

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

      renderer.render(scene, camera);
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

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isDayMode]);

  return <div ref={mountRef} className="absolute inset-0" />;
};

export default ThreeJsBackground;
