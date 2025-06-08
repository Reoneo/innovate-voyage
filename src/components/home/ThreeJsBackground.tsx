
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeJsBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Initialize scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // Slate-900 background
    sceneRef.current = scene;

    // Initialize camera (fixed position, no controls)
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 100);
    camera.position.set(0, 0, 15);

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Create 1000 cubes
    const cubes: THREE.Mesh[] = [];
    const cubeGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    
    // Create materials with different colors for variety
    const materials = [
      new THREE.MeshBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.6 }), // blue
      new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.6 }), // purple
      new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.6 }), // cyan
      new THREE.MeshBasicMaterial({ color: 0x64748b, transparent: true, opacity: 0.4 }), // slate
    ];

    for (let i = 0; i < 1000; i++) {
      const material = materials[Math.floor(Math.random() * materials.length)];
      const cube = new THREE.Mesh(cubeGeometry, material);

      // Position cubes in a large sphere around the camera
      const sphericalPosition = new THREE.Spherical(
        5 + Math.random() * 40, // radius between 5 and 45
        Math.random() * Math.PI, // phi (0 to PI)
        Math.random() * Math.PI * 2 // theta (0 to 2*PI)
      );
      
      const position = new THREE.Vector3();
      position.setFromSpherical(sphericalPosition);
      cube.position.copy(position);

      // Random rotation
      cube.rotation.x = Math.random() * Math.PI * 2;
      cube.rotation.y = Math.random() * Math.PI * 2;
      cube.rotation.z = Math.random() * Math.PI * 2;

      // Store initial position and random speeds for animation
      cube.userData = {
        initialPosition: position.clone(),
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.01
        },
        floatSpeed: (Math.random() - 0.5) * 0.02,
        floatOffset: Math.random() * Math.PI * 2
      };

      scene.add(cube);
      cubes.push(cube);
    }

    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.01;

      // Animate each cube
      cubes.forEach((cube, index) => {
        // Rotate cubes
        cube.rotation.x += cube.userData.rotationSpeed.x;
        cube.rotation.y += cube.userData.rotationSpeed.y;
        cube.rotation.z += cube.userData.rotationSpeed.z;

        // Add subtle floating motion
        const floatY = Math.sin(time + cube.userData.floatOffset) * cube.userData.floatSpeed;
        cube.position.y = cube.userData.initialPosition.y + floatY;

        // Very subtle orbit around original position
        const orbitAngle = time * 0.1 + index * 0.01;
        const orbitRadius = 0.5;
        cube.position.x = cube.userData.initialPosition.x + Math.cos(orbitAngle) * orbitRadius;
        cube.position.z = cube.userData.initialPosition.z + Math.sin(orbitAngle) * orbitRadius;
      });

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js resources
      cubes.forEach(cube => {
        cube.geometry.dispose();
        if (Array.isArray(cube.material)) {
          cube.material.forEach(mat => mat.dispose());
        } else {
          cube.material.dispose();
        }
      });
      
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 w-full h-full"
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}
    />
  );
};

export default ThreeJsBackground;
