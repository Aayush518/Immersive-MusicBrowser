import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  audioData: Uint8Array;
  bassLevel: number;
}

export const AudioVisualizerScene: React.FC<Props> = ({ audioData, bassLevel }) => {
  const groupRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const baseRadius = 5;
    
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const radius = baseRadius + (Math.random() * 2);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      positions[i * 3] = isNaN(x) ? 0 : x;
      positions[i * 3 + 1] = isNaN(y) ? 0 : y;
      positions[i * 3 + 2] = isNaN(z) ? 0 : z;
      
      colors[i * 3] = 0.5;
      colors[i * 3 + 1] = 0.5;
      colors[i * 3 + 2] = 0.5;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.computeBoundingSphere();
    
    return geometry;
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !particlesRef.current) return;
    
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.1;
    
    const positions = particles.attributes.position.array as Float32Array;
    const colors = particles.attributes.color.array as Float32Array;
    const baseRadius = 5;
    
    for (let i = 0; i < positions.length; i += 3) {
      const i3 = i / 3;
      const audioIndex = i3 % audioData.length;
      const audioValue = Math.min(audioData[audioIndex] / 255, 1);
      
      // Get the original position
      const theta = (i3 / positions.length) * Math.PI * 2;
      const phi = Math.acos((i3 / positions.length) * 2 - 1);
      const radius = baseRadius + (Math.random() * 0.1); // Small random variation
      
      // Calculate base position
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      // Apply audio-reactive scaling with bounds checking
      const scale = 1 + (audioValue * bassLevel);
      positions[i] = isNaN(x * scale) ? x : x * scale;
      positions[i + 1] = isNaN(y * scale) ? y : y * scale;
      positions[i + 2] = isNaN(z * scale) ? z : z * scale;
      
      // Smooth color transitions
      colors[i] = Math.max(0, Math.min(1, Math.sin(audioValue + time) * 0.5 + 0.5));
      colors[i + 1] = Math.max(0, Math.min(1, Math.cos(audioValue + time) * 0.5 + 0.5));
      colors[i + 2] = Math.max(0, Math.min(1, bassLevel));
    }
    
    particles.attributes.position.needsUpdate = true;
    particles.attributes.color.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ff0066" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#00ffff" />
      
      <points ref={particlesRef} geometry={particles}>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
      
      <mesh>
        <sphereGeometry args={[4, 32, 32]} />
        <meshPhongMaterial
          color="#000000"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};