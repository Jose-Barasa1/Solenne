// File: src/components/CrystalParticles.jsx
'use client';

import { useEffect, useRef } from 'react';
import { createNoise2D } from 'simplex-noise';
import * as THREE from 'three';

export default function CrystalParticles() {
  const containerRef = useRef();
  const rendererRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();
  const particlesRef = useRef();
  const animationId = useRef();

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    const particles = new THREE.BufferGeometry();
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);
    const noise = createNoise2D();

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xcc88ff,
      size: 1.5,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    });

    const pointCloud = new THREE.Points(particles, material);
    scene.add(pointCloud);

    function animate() {
      pointCloud.rotation.y += 0.0005;
      pointCloud.rotation.x += 0.0002;
      renderer.render(scene, camera);
      animationId.current = requestAnimationFrame(animate);
    }

    animate();

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    particlesRef.current = pointCloud;

    return () => {
      cancelAnimationFrame(animationId.current);
      renderer.dispose();
      containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }} />;
}
