'use client';

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { Group, Box3, Vector3 } from 'three';

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
  const gltf = useGLTF(modelPath);
  const groupRef = useRef<Group>(null);
  const rotationRef = useRef(rotation);
  
  const modelScene = gltf?.scene;

  // Center and scale the model
  const centeredScene = useMemo(() => {
    if (!modelScene) return null;
    const clonedScene = modelScene.clone();
    const box = new Box3().setFromObject(clonedScene);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = 2.5 / maxDim; // Scale to fit in a 2.5 unit box

    clonedScene.position.x = -center.x;
    clonedScene.position.y = -center.y;
    clonedScene.position.z = -center.z;
    clonedScene.scale.multiplyScalar(scaleFactor);

    return clonedScene;
  }, [modelScene]);

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

  // Early returns after all hooks
  if (!gltf || !gltf.scene) {
    console.error('Model failed to load:', modelPath);
    return (
      <mesh scale={scale} position={position}>
        <boxGeometry args={[2, 1, 4]} />
        <meshStandardMaterial color="hsl(var(--muted-foreground))" />
      </mesh>
    );
  }
  
  if (!centeredScene) {
    return (
      <mesh scale={scale} position={position}>
        <boxGeometry args={[2, 1, 4]} />
        <meshStandardMaterial color="hsl(var(--muted-foreground))" />
      </mesh>
    );
  }

  return (
    // @ts-ignore
    <group ref={groupRef} scale={scale} position={position}>
      {/* @ts-ignore */}
      <primitive object={centeredScene} />
    </group>
  );
}

// Note: Models will be loaded on demand. For preloading, add to a separate file if needed.

