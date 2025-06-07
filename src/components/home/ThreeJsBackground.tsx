
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
    
    // Professional gradient background
    scene.background = new THREE.Color(isDayMode ? 0x1e3a8a : 0x0f172a);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    mountRef.current.appendChild(renderer.domElement);

    // Create 1000 professional-looking cubes
    const cubes: THREE.Mesh[] = [];
    const cubeGeometry = new THREE.BoxGeometry(0.15, 0.15, 0.15);
    
    for (let i = 0; i < 1000; i++) {
      // Professional color palette
      const hue = isDayMode 
        ? (i * 0.618033988749895) % 1  // Golden ratio for even distribution
        : (i * 0.618033988749895) % 1;
      
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(
          hue, 
          isDayMode ? 0.6 : 0.8, 
          isDayMode ? 0.7 : 0.4
        ),
        transparent: true,
        opacity: isDayMode ? 0.6 : 0.4
      });

      const cube = new THREE.Mesh(cubeGeometry, material);
      
      // More organized distribution
      const radius = 20 + Math.random() * 60;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      cube.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
      
      cube.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      scene.add(cube);
      cubes.push(cube);
    }

    camera.position.z = 25;

    // Professional animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Smooth, professional rotation
      cubes.forEach((cube, index) => {
        const speed = 0.002 + (index * 0.000005);
        cube.rotation.x += speed;
        cube.rotation.y += speed * 0.7;
        
        // Gentle wave motion
        cube.position.y += Math.sin(Date.now() * 0.001 + index * 0.1) * 0.01;
      });

      // Smooth camera movement
      camera.position.x = Math.sin(Date.now() * 0.0003) * 3;
      camera.position.y = Math.cos(Date.now() * 0.0002) * 2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

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
