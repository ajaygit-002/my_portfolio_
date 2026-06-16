import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMousePosition } from '../../hooks/useMousePosition';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export const ParticleField = () => {
  const pointsRef = useRef();
  const mouse = useMousePosition();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Reduce particle count on mobile for performance
  const count = isMobile ? 60 : 150;

  // Generate random coords and speed arrays
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const speed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;      // X coordinate range
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;  // Y coordinate range
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;  // Z coordinate range
      speed[i] = Math.random() * 0.03 + 0.01;
    }
    return [pos, speed];
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const positionsAttr = pointsRef.current.geometry.attributes.position;
    
    // Animate point coordinates
    for (let i = 0; i < count; i++) {
      // Slow drifting downward movement
      positionsAttr.array[i * 3 + 1] -= speeds[i] * 0.1;
      
      // Loop points that exit the bottom boundary back to top
      if (positionsAttr.array[i * 3 + 1] < -7) {
        positionsAttr.array[i * 3 + 1] = 7;
      }
      
      // Horizontal subtle wave sway
      positionsAttr.array[i * 3] += Math.sin(time * 0.5 + i) * 0.0015;
    }
    positionsAttr.needsUpdate = true;

    // Parallax mouse tilt effect
    const targetX = (mouse.x / window.innerWidth - 0.5) * 0.4;
    const targetY = (mouse.y / window.innerHeight - 0.5) * 0.4;
    
    pointsRef.current.rotation.y += (targetX - pointsRef.current.rotation.y) * 0.05;
    pointsRef.current.rotation.x += (targetY - pointsRef.current.rotation.x) * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00E5FF"
        size={isMobile ? 0.035 : 0.05}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
