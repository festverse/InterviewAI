import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

function AnimatedGeometry() {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.05;
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <icosahedronGeometry args={[4, 1]} />
      <meshBasicMaterial color="#333333" wireframe transparent opacity={0.3} />
    </mesh>
  );
}

const Background3D = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
      <Canvas 
        camera={{ position: [0, 0, 5] }} 
        dpr={[1, 1]} 
        gl={{ alpha: false, antialias: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={['#000000']} />
        <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={2} />
        <AnimatedGeometry />
      </Canvas>
    </div>
  );
};

export default Background3D;
