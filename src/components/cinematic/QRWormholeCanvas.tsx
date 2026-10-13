'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

export default function QRWormholeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const scaleProgress = useTransform(smoothProgress, [0.1, 0.5, 0.9], [0.8, 1.2, 1]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Three.js Scene Setup for 3D Geometric Tunnel
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.05);

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const updateSize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    mountRef.current.appendChild(renderer.domElement);
    updateSize();

    // Create 3D Optical QR Tunnel Rings & Grid Geometry
    const tunnelGroup = new THREE.Group();
    const ringCount = 20;
    const rings: THREE.LineSegments[] = [];

    for (let i = 0; i < ringCount; i++) {
      const geometry = new THREE.BoxGeometry(3, 3, 0.2);
      const edges = new THREE.EdgesGeometry(geometry);
      const material = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0xffffff : 0x888888,
        transparent: true,
        opacity: 0.7 - (i / ringCount) * 0.5,
      });

      const ring = new THREE.LineSegments(edges, material);
      ring.position.z = -i * 1.5;
      ring.rotation.z = (i * Math.PI) / 8;
      rings.push(ring);
      tunnelGroup.add(ring);
    }

    // Add Floating Digital Matrix Block Particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount * 3; p += 3) {
      posArray[p] = (Math.random() - 0.5) * 10;
      posArray[p + 1] = (Math.random() - 0.5) * 10;
      posArray[p + 2] = -Math.random() * 30;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    tunnelGroup.add(particles);

    scene.add(tunnelGroup);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Tunnel rotation & forward flight effect
      tunnelGroup.rotation.z += 0.005;
      rings.forEach((ring, idx) => {
        ring.position.z += 0.04;
        if (ring.position.z > 5) {
          ring.position.z = -ringCount * 1.5;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full py-20 bg-black overflow-hidden border-y border-white/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
        
        <span className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold text-white uppercase tracking-wider">
          SIGNATURE WORMHOLE TRANSITION
        </span>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          Entering the Optical QR Dimension.
        </h2>

        <p className="text-neutral-400 text-base max-w-xl mx-auto font-mono text-xs">
          Scanning optical geometry converts physical touchpoints directly into encrypted server proxy routing.
        </p>

        {/* 3D WebGL QR Wormhole Tunnel Canvas */}
        <motion.div
          style={{ scale: scaleProgress }}
          className="relative w-full h-[400px] sm:h-[500px] rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black"
        >
          <div ref={mountRef} className="w-full h-full" />
          
          {/* Overlay Status Bar */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-xs font-mono text-white bg-black/70 p-4 rounded-2xl border border-white/15 backdrop-blur-md">
            <span>3D GEOMETRIC TUNNEL FLIGHT</span>
            <span className="font-bold text-white animate-pulse">OPTICAL SCAN COMPLETE</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
