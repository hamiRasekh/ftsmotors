'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Lazy load Three.js components to avoid SSR issues
let Canvas: any;
let OrbitControls: any;
let Environment: any;
let PerspectiveCamera: any;
let CarModel: any;

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
  const [isClient, setIsClient] = useState(false);
  const [componentsLoaded, setComponentsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    setIsClient(true);
    // Load components dynamically
    Promise.all([
      import('@react-three/fiber').catch((e) => {
        console.error('Failed to load @react-three/fiber:', e);
        return null;
      }),
      import('@react-three/drei').catch((e) => {
        console.error('Failed to load @react-three/drei:', e);
        return null;
      }),
      import('./CarModel').catch((e) => {
        console.error('Failed to load CarModel:', e);
        return null;
      }),
    ]).then(([fiber, drei, carModel]) => {
      if (fiber) {
        Canvas = fiber.Canvas;
      }
      if (drei) {
        OrbitControls = drei.OrbitControls;
        Environment = drei.Environment;
        PerspectiveCamera = drei.PerspectiveCamera;
        // Preload the model if useGLTF is available
        if (drei.useGLTF && drei.useGLTF.preload) {
          try {
            drei.useGLTF.preload(modelPath);
          } catch (e) {
            console.warn('Failed to preload model:', e);
          }
        }
      }
      if (carModel) {
        CarModel = carModel.CarModel;
      }
      setComponentsLoaded(true);
    }).catch((error) => {
      console.error('Error loading 3D components:', error);
      setComponentsLoaded(true); // Still set to true to show fallback
    });
  }, [modelPath]);

  if (!isClient || !componentsLoaded) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
          <div className="text-gray-500">در حال بارگذاری مدل 3D...</div>
        </div>
      </div>
    );
  }

  if (!Canvas) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 ${className}`}>
        <div className="text-center p-8">
          <div className="text-4xl mb-4">🚗</div>
          <div className="text-gray-600 mb-2">مدل 3D</div>
          <div className="text-sm text-gray-500">در حال آماده‌سازی...</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Canvas
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        dpr={typeof window !== 'undefined' && window.devicePixelRatio ? [1, Math.min(window.devicePixelRatio, 2)] : [1, 2]}
        camera={{ position: cameraPosition, fov: 50 }}
        performance={{ min: 0.5 }}
        shadows={false}
      >
        <Suspense fallback={
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="gray" />
          </mesh>
        }>
          {PerspectiveCamera && <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />}
          {/* @ts-ignore */}
          <ambientLight intensity={1.2} />
          {/* @ts-ignore */}
          <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow={false} />
          {/* @ts-ignore */}
          <directionalLight position={[-5, 3, -5]} intensity={0.8} castShadow={false} />
          {/* @ts-ignore */}
          <pointLight position={[0, 10, 0]} intensity={0.5} />
          {Environment && <Environment preset="sunset" />}
          {CarModel ? (
            <CarModel
              modelPath={modelPath}
              rotation={rotation}
              autoRotate={autoRotate}
              rotationSpeed={rotationSpeed}
              scale={scale}
              position={position}
            />
          ) : (
            <mesh>
              <boxGeometry args={[2, 1, 4]} />
              <meshStandardMaterial color="#888888" />
            </mesh>
          )}
          {enableControls && OrbitControls && (
            <OrbitControls
              enableZoom={true}
              enablePan={false}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 2}
              minDistance={5}
              maxDistance={15}
            />
          )}
        </Suspense>
      </Canvas>
    </motion.div>
  );
}

