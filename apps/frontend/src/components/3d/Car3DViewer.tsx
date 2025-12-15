'use client';

import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { CarModel } from './CarModel';
import { motion } from 'framer-motion';
import type { ThreeElements } from '@react-three/fiber';

interface Car3DViewerProps {
  modelPath: string;
  rotation?: number;
  autoRotate?: boolean;
  rotationSpeed?: number;
  scale?: number;
  position?: [number, number, number];
  className?: string;
  enableControls?: boolean;
  cameraPosition?: [number, number, number];
}

export function Car3DViewer({
  modelPath,
  rotation = 0,
  autoRotate = false,
  rotationSpeed = 0.01,
  scale = 1,
  position = [0, 0, 0],
  className = '',
  enableControls = false,
  cameraPosition = [0, 5, 10],
}: Car3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Canvas
        gl={{ antialias: true, alpha: true }}
        dpr={typeof window !== 'undefined' && window.devicePixelRatio ? [1, Math.min(window.devicePixelRatio, 2)] : [1, 2]}
        camera={{ position: cameraPosition, fov: 50 }}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
          {/* @ts-ignore */}
          <ambientLight intensity={0.5} />
          {/* @ts-ignore */}
          <directionalLight position={[10, 10, 5]} intensity={1} />
          {/* @ts-ignore */}
          <pointLight position={[-10, -10, -5]} intensity={0.5} />
          <Environment preset="city" />
          <CarModel
            modelPath={modelPath}
            rotation={rotation}
            autoRotate={autoRotate}
            rotationSpeed={rotationSpeed}
            scale={scale}
            position={position}
          />
          {enableControls && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 2}
            />
          )}
        </Suspense>
      </Canvas>
      
    </motion.div>
  );
}

