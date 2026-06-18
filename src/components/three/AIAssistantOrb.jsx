import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMousePosition } from '../../hooks/useMousePosition';

export const AIAssistantOrb = () => {
  const orbRef = useRef();
  const innerRef = useRef();
  const ringRef = useRef();
  const mouse = useMousePosition();

  useFrame((state) => {
    if (!orbRef.current || !innerRef.current || !ringRef.current) return;
    const time = state.clock.getElapsedTime();

    // Orb hovering animation
    orbRef.current.position.y = Math.sin(time * 2) * 0.15;
    
    // Rotating the orb
    orbRef.current.rotation.y = time * 0.5;
    orbRef.current.rotation.x = time * 0.2;

    // Pulse animation for inner core
    const scale = 1 + Math.sin(time * 4) * 0.1;
    innerRef.current.scale.set(scale, scale, scale);

    // Ring animation
    ringRef.current.rotation.x = Math.PI / 2 + Math.sin(time) * 0.2;
    ringRef.current.rotation.y = time * 1.5;

    // Mouse parallax tilt
    const targetX = (mouse.x / window.innerWidth - 0.5) * 0.5;
    const targetY = (mouse.y / window.innerHeight - 0.5) * 0.5;
    
    orbRef.current.rotation.y += (targetX - orbRef.current.rotation.y) * 0.1;
    orbRef.current.rotation.x += (targetY - orbRef.current.rotation.x) * 0.1;
  });

  return (
    <group ref={orbRef}>
      {/* Outer Glass Sphere */}
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshPhysicalMaterial
          color="#00F5FF"
          transmission={0.9}
          opacity={1}
          metalness={0.2}
          roughness={0.1}
          ior={1.5}
          thickness={1.5}
          specularIntensity={1}
          specularColor="#ffffff"
          transparent={true}
        />
      </mesh>

      {/* Inner Glowing Core */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial
          color="#7C3AED"
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Voice-wave / Energy Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1.8, 0.02, 16, 100]} />
        <meshBasicMaterial
          color="#00F5FF"
          transparent={true}
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Core Light */}
      <pointLight color="#7C3AED" intensity={4} distance={10} />
      <pointLight color="#00F5FF" intensity={2} distance={5} />
    </group>
  );
};
