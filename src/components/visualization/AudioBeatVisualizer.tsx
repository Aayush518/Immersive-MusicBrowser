import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useAudioContext } from '../../contexts/AudioContext';

export const AudioBeatVisualizer = () => {
  const { audioData, bassLevel } = useAudioContext();
  const groupRef = useRef<THREE.Group>(null);
  
  const particles = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 3 + Math.random() * 2;
      
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
    if (!groupRef.current) return;
    
    const time = state.clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.1;
    
    const positions = particles.attributes.position.array as Float32Array;
    const colors = particles.attributes.color.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      const i3 = Math.floor(i / 3);
      const audioIndex = i3 % audioData.length;
      const audioValue = audioData[audioIndex] / 255;
      
      const originalPos = new THREE.Vector3(
        positions[i],
        positions[i + 1],
        positions[i + 2]
      ).normalize();
      
      const scale = 3 + (audioValue * bassLevel * 2);
      
      positions[i] = originalPos.x * scale;
      positions[i + 1] = originalPos.y * scale;
      positions[i + 2] = originalPos.z * scale;
      
      // Dynamic color based on audio intensity
      const hue = (time * 0.1 + audioValue) % 1;
      const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    
    particles.attributes.position.needsUpdate = true;
    particles.attributes.color.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <points geometry={particles}>
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