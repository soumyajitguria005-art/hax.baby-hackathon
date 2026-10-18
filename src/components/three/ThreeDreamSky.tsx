import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeDreamSkyProps {
  theme?: 'day' | 'night';
}

export const ThreeDreamSky: React.FC<ThreeDreamSkyProps> = ({ theme = 'night' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 2. 350 Instanced Star Points in 3D Space
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const goldColor = new THREE.Color(0xf1c66d);
    const pinkColor = new THREE.Color(0xf472b6);
    const whiteColor = new THREE.Color(0xfff8f1);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 45;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

      const pick = Math.random();
      const col = pick > 0.6 ? goldColor : pick > 0.3 ? pinkColor : whiteColor;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: theme === 'night' ? 0.75 : 0.45,
    });

    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Pointer Parallax Tracking
    let targetCamX = 0;
    let targetCamY = 0;
    let currentCamX = 0;
    let currentCamY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normY = (e.clientY / window.innerHeight - 0.5) * 2;
      targetCamX = normX * 2.2;
      targetCamY = -normY * 1.8;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth camera damping
      currentCamX = THREE.MathUtils.damp(currentCamX, targetCamX, 3.5, delta);
      currentCamY = THREE.MathUtils.damp(currentCamY, targetCamY, 3.5, delta);
      camera.position.x = currentCamX;
      camera.position.y = currentCamY;
      camera.lookAt(0, 0, 0);

      // Gentle starfield drift & pulse
      starField.rotation.y = elapsed * 0.02;
      starField.rotation.x = Math.sin(elapsed * 0.015) * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);

      starGeo.dispose();
      starMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [theme]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-70"
      aria-hidden="true"
    />
  );
};
