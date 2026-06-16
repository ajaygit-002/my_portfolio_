import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { orbitSkills } from '../../data/skills';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export const SkillsOrbit = ({ onSelectSkill }) => {
  const groupRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [hoveredRing, setHoveredRing] = useState(null);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Dimensions based on device
  const ring1Radius = isMobile ? 1.7 : 2.2;
  const ring2Radius = isMobile ? 2.8 : 3.6;
  const textFontSize = isMobile ? 0.18 : 0.22;

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Hover speeds up continuous orbits
    const speedMultiplier = hoveredRing ? 2.5 : 1.0;
    
    if (ring1Ref.current) {
      ring1Ref.current.rotation.y = time * 0.12 * speedMultiplier;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -time * 0.08 * speedMultiplier;
    }
    
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.03;
    }
  });

  // Cleanup cursor on unmount
  useEffect(() => {
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={1.5} />
      <pointLight position={[8, 8, 8]} intensity={2} color="#00E5FF" />
      <pointLight position={[-8, -8, -8]} intensity={1} color="#7C3AED" />

      {/* Glowing Central Sphere */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={0.7}
          roughness={0.15}
        />
      </mesh>

      {/* Ring 1 - Inner Orbit */}
      <group 
        ref={ring1Ref} 
        rotation={[0.3, 0.25, 0.15]}
        onPointerOver={() => setHoveredRing(1)}
        onPointerOut={() => setHoveredRing(null)}
      >
        {/* Ring Guide Line */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[ring1Radius - 0.015, ring1Radius + 0.015, 64]} />
          <meshBasicMaterial color="#00E5FF" opacity={0.12} transparent={true} side={THREE.DoubleSide} />
        </mesh>

        {orbitSkills.ring1.map((skill, idx) => {
          const angle = (idx / orbitSkills.ring1.length) * Math.PI * 2;
          const x = ring1Radius * Math.cos(angle);
          const z = ring1Radius * Math.sin(angle);
          const isHovered = hoveredSkill === skill.name;

          return (
            <group 
              key={skill.name} 
              position={[x, 0, z]}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredSkill(skill.name);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredSkill(null);
                document.body.style.cursor = 'auto';
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectSkill(skill.name);
              }}
            >
              {/* Skill point sphere */}
              <mesh>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial 
                  color={skill.color} 
                  emissive={skill.color}
                  emissiveIntensity={isHovered ? 1.6 : 0.6}
                />
              </mesh>
              
              {/* Text label billboard */}
              <Text
                position={[0, 0.25, 0]}
                fontSize={textFontSize}
                color={isHovered ? "#00FFA3" : "#FFFFFF"}
                anchorX="center"
                anchorY="middle"
                // Standard billboard effect: rotate text opposite to ring
                rotation={[0, -ring1Ref.current?.rotation?.y || 0, 0]}
              >
                {skill.name}
              </Text>
            </group>
          );
        })}
      </group>

      {/* Ring 2 - Outer Orbit */}
      <group 
        ref={ring2Ref} 
        rotation={[-0.35, -0.2, 0.1]}
        onPointerOver={() => setHoveredRing(2)}
        onPointerOut={() => setHoveredRing(null)}
      >
        {/* Ring Guide Line */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[ring2Radius - 0.015, ring2Radius + 0.015, 64]} />
          <meshBasicMaterial color="#7C3AED" opacity={0.12} transparent={true} side={THREE.DoubleSide} />
        </mesh>

        {orbitSkills.ring2.map((skill, idx) => {
          const angle = (idx / orbitSkills.ring2.length) * Math.PI * 2;
          const x = ring2Radius * Math.cos(angle);
          const z = ring2Radius * Math.sin(angle);
          const isHovered = hoveredSkill === skill.name;

          return (
            <group 
              key={skill.name} 
              position={[x, 0, z]}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredSkill(skill.name);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredSkill(null);
                document.body.style.cursor = 'auto';
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelectSkill(skill.name);
              }}
            >
              <mesh>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshStandardMaterial 
                  color={skill.color} 
                  emissive={skill.color}
                  emissiveIntensity={isHovered ? 1.6 : 0.6}
                />
              </mesh>
              
              <Text
                position={[0, 0.28, 0]}
                fontSize={textFontSize}
                color={isHovered ? "#00FFA3" : "#FFFFFF"}
                anchorX="center"
                anchorY="middle"
                rotation={[0, -ring2Ref.current?.rotation?.y || 0, 0]}
              >
                {skill.name}
              </Text>
            </group>
          );
        })}
      </group>
    </group>
  );
};
