import * as THREE from 'three';

export const getSpherePoints = (count, radius) => {
  const points = [];
  for (let i = 0; i < count; i++) {
    // Distribute points evenly inside a sphere volume
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = radius * Math.cbrt(Math.random());

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);
    
    points.push(new THREE.Vector3(x, y, z));
  }
  return points;
};
