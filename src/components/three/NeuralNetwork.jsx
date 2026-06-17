import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getSpherePoints } from '../../utils/three-helpers';
import { useMousePosition } from '../../hooks/useMousePosition';
import { useMediaQuery } from '../../hooks/useMediaQuery';

export const NeuralNetwork = () => {
  const groupRef = useRef();
  const mouse = useMousePosition();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Set node count based on device class
  const nodeCount = isMobile ? 12 : 18;
  const radius = 2.2;
  const maxDistance = 1.7;

  // 1. Generate node coordinates inside the sphere volume
  const nodePositions = useMemo(() => {
    return getSpherePoints(nodeCount, radius);
  }, [nodeCount]);

  // 2. Compute connection segments and store line array
  const [connections, linePositions] = useMemo(() => {
    const conn = [];
    const linePos = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < maxDistance) {
          conn.push({
            start: nodePositions[i],
            end: nodePositions[j],
            progress: Math.random(),
            speed: Math.random() * 0.007 + 0.003
          });
          linePos.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
          linePos.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
        }
      }
    }
    return [conn, new Float32Array(linePos)];
  }, [nodePositions, nodeCount]);

  // Array to hold reference to traveling signal spheres
  const particleRefs = useRef([]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Constant slow Y-axis rotation and small X-axis sway
    groupRef.current.rotation.y += 0.0025;
    groupRef.current.rotation.x = Math.sin(time * 0.25) * 0.08;

    // Mouse parallax tilt
    const targetX = (mouse.x / window.innerWidth - 0.5) * 0.45;
    const targetY = (mouse.y / window.innerHeight - 0.5) * 0.3;
    groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (targetY - groupRef.current.rotation.x) * 0.05;

    // Animate travelling light particles along the connections
    connections.forEach((c, idx) => {
      c.progress += c.speed;
      if (c.progress > 1) {
        c.progress = 0;
        c.speed = Math.random() * 0.007 + 0.003; // Randomize next run speed
      }
      
      const particleMesh = particleRefs.current[idx];
      if (particleMesh) {
        // Interpolate position from start node to end node
        const currentPos = new THREE.Vector3().lerpVectors(c.start, c.end, c.progress);
        particleMesh.position.copy(currentPos);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Lights */}
      <ambientLight intensity={1.6} />
      <pointLight position={[10, 10, 10]} intensity={2.5} color="#2563EB" />
      <pointLight position={[-10, -10, -10]} intensity={1.2} color="#8B5CF6" />

      {/* Render Node Spheres */}
      {nodePositions.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshStandardMaterial
            color="#2563EB"
            emissive="#2563EB"
            emissiveIntensity={0.5}
            roughness={0.1}
            metalness={0.2}
          />
        </mesh>
      ))}

      {/* Render Connection Segment Lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#2563EB"
          transparent={true}
          opacity={0.3}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Render Signal Particles traveling on lines */}
      {connections.map((_, idx) => (
        <mesh
          key={`particle-${idx}`}
          ref={(el) => (particleRefs.current[idx] = el)}
        >
          <sphereGeometry args={[0.038, 8, 8]} />
          <meshBasicMaterial
            color="#10B981"
            transparent={true}
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};
