import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ParticleField } from './ParticleField';

export const BackgroundCanvas = () => {
  return (
    <div className="fixed inset-0 -z-20 pointer-events-none w-full h-full bg-[#050816] overflow-hidden">
      {/* Aurora shimmer glow elements */}
      <div className="aurora-bg">
        <div className="aurora-glow-1" />
        <div className="aurora-glow-2" />
        <div className="aurora-glow-3" />
      </div>
      
      {/* Subtle digital grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle, #00E5FF 1.5px, transparent 1.5px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Particle Canvas */}
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>
      </Canvas>
    </div>
  );
};
