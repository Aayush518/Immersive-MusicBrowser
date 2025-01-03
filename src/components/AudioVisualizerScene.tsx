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
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const radius = 3 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      colors[i * 3] = Math.random();
      colors[i * 3 + 1] = Math.random();
      colors[i * 3 + 2] = Math.random();
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return geometry;
  }, []);

  useFrame((state) => {
    if (!groupRef.current || !particlesRef.current) return;
    
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.1;
    
    const positions = particles.attributes.position.array as Float32Array;
    const colors = particles.attributes.color.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const i3 = Math.floor(i / 3);
      const audioIndex = i3 % audioData.length;
      const audioValue = audioData[audioIndex] / 255;
      
      const originalX = positions[i];
      const originalY = positions[i + 1];
      const originalZ = positions[i + 2];
      
      const distance = Math.sqrt(
        originalX * originalX +
        originalY * originalY +
        originalZ * originalZ
      );
      
      const scale = 1 + (audioValue * bassLevel * 0.5);
      
      positions[i] = originalX * scale;
      positions[i + 1] = originalY * scale;
      positions[i + 2] = originalZ * scale;
      
      // Dynamic color based on audio and position
      colors[i] = 0.5 + Math.sin(time + distance) * 0.5;
      colors[i + 1] = 0.5 + Math.cos(time + distance) * 0.5;
      colors[i + 2] = 0.5 + Math.sin(time * 0.5 + distance) * 0.5;
    }
    
    particles.attributes.position.needsUpdate = true;
    particles.attributes.color.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
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
    </group>
  );
};