'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group } from 'three';

interface CarModelProps {
  modelPath: string;
  rotation?: number;
  autoRotate?: boolean;
  rotationSpeed?: number;
  scale?: number;
  position?: [number, number, number];
}

export function CarModel({
  modelPath,
  rotation = 0,
  autoRotate = false,
  rotationSpeed = 0.01,
  scale = 1,
  position = [0, 0, 0],
}: CarModelProps) {
  const { scene } = useGLTF(modelPath);
  const groupRef = useRef<Group>(null);
  const rotationRef = useRef(rotation);

  // Update rotation ref when prop changes
  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  useFrame((_state: any, delta: number) => {
    if (groupRef.current) {
      if (autoRotate) {
        groupRef.current.rotation.y += rotationSpeed * delta;
      } else {
        groupRef.current.rotation.y = rotationRef.current;
      }
    }
  });

  return (
    // @ts-ignore
    <group ref={groupRef} scale={scale} position={position}>
      {/* @ts-ignore */}
      <primitive object={scene} />
    </group>
  );
}

// Note: Models will be loaded on demand. For preloading, add to a separate file if needed.

