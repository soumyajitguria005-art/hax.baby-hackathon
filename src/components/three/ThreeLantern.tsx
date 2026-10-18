import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeLanternProps {
  isLit: boolean;
  color: string;
  intensity?: number;
  className?: string;
}

export const ThreeLantern: React.FC<ThreeLanternProps> = ({
  isLit,
  color,
  intensity = 80,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isLitRef = useRef(isLit);
  const colorRef = useRef(color);
  const intensityRef = useRef(intensity);

  isLitRef.current = isLit;
  colorRef.current = color;
  intensityRef.current = intensity;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 180;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 3.8);
    camera.lookAt(0, 0.7, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Ambient & Rim Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8f1, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffecd2, 1.4);
    dirLight.position.set(3, 4, 3);
    scene.add(dirLight);

    // 3. Lantern Assembly
    const lanternGroup = new THREE.Group();
    scene.add(lanternGroup);

    // Materials
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Warm antique brass
      roughness: 0.28,
      metalness: 0.85,
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.35,
    });

    const candleMat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.4,
      metalness: 0.05,
    });

    const flameMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(colorRef.current),
      transparent: true,
      opacity: 0.95,
    });

    // Part 1: Hexagonal Brass Base Pedestal
    const baseGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.16, 6);
    const baseMesh = new THREE.Mesh(baseGeo, brassMat);
    baseMesh.position.y = 0.08;
    lanternGroup.add(baseMesh);

    // Part 2: Hexagonal Glass Body
    const glassGeo = new THREE.CylinderGeometry(0.75, 0.8, 1.1, 6, 1, true);
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.y = 0.71;
    lanternGroup.add(glassMesh);

    // Part 3: 6 Vertical Brass Struts
    const strutGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.1, 8);
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const strut = new THREE.Mesh(strutGeo, brassMat);
      strut.position.set(Math.cos(angle) * 0.78, 0.71, Math.sin(angle) * 0.78);
      lanternGroup.add(strut);
    }

    // Part 4: Upper Brass Collar
    const collarGeo = new THREE.CylinderGeometry(0.78, 0.78, 0.1, 6);
    const collarMesh = new THREE.Mesh(collarGeo, brassMat);
    collarMesh.position.y = 1.28;
    lanternGroup.add(collarMesh);

    // Part 5: Stepped Hexagonal Brass Roof Pyramid / Cap
    const roofGeo = new THREE.ConeGeometry(0.88, 0.55, 6);
    const roofMesh = new THREE.Mesh(roofGeo, brassMat);
    roofMesh.position.y = 1.58;
    lanternGroup.add(roofMesh);

    // Part 6: Brass Finial Top Post
    const finialGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.18, 12);
    const finialMesh = new THREE.Mesh(finialGeo, brassMat);
    finialMesh.position.y = 1.92;
    lanternGroup.add(finialMesh);

    // Part 7: Brass Hanging Ring Handle
    const ringGeo = new THREE.TorusGeometry(0.24, 0.04, 12, 24);
    const ringMesh = new THREE.Mesh(ringGeo, brassMat);
    ringMesh.position.y = 2.18;
    lanternGroup.add(ringMesh);

    // Part 8: Interior Wax Candle
    const candleGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.45, 16);
    const candleMesh = new THREE.Mesh(candleGeo, candleMat);
    candleMesh.position.y = 0.385;
    lanternGroup.add(candleMesh);

    // Part 9: Glowing Candle Flame Mesh
    const flameGeo = new THREE.ConeGeometry(0.09, 0.22, 12);
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.y = 0.72;
    lanternGroup.add(flameMesh);

    // Part 10: Dynamic PointLight inside the lantern
    const lanternPointLight = new THREE.PointLight(
      new THREE.Color(colorRef.current),
      isLitRef.current ? (intensityRef.current / 100) * 3.5 : 0,
      6
    );
    lanternPointLight.position.set(0, 0.75, 0);
    lanternGroup.add(lanternPointLight);

    // Part 11: Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x0f0b18,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.01;
    scene.add(shadowMesh);

    // Interactive Drag / Hover rotation
    let isDragging = false;
    let prevMouseX = 0;
    let targetRotationY = 0.25;
    let currentRotationY = 0.25;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) {
        const rect = container.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        targetRotationY = 0.25 + normX * 0.7;
        return;
      }
      const deltaX = e.clientX - prevMouseX;
      prevMouseX = e.clientX;
      targetRotationY += deltaX * 0.015;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth damping on Y rotation
      currentRotationY = THREE.MathUtils.damp(currentRotationY, targetRotationY, 8, delta);
      lanternGroup.rotation.y = currentRotationY;

      // Update light state and color dynamically
      const activeColor = new THREE.Color(colorRef.current);
      flameMat.color.copy(activeColor);
      lanternPointLight.color.copy(activeColor);

      if (isLitRef.current) {
        // Natural candle flicker
        const flicker = 1 + Math.sin(elapsed * 12) * 0.08 + Math.cos(elapsed * 23) * 0.05;
        const targetIntensity = (intensityRef.current / 100) * 3.2 * flicker;
        lanternPointLight.intensity = targetIntensity;
        flameMesh.visible = true;
        flameMesh.scale.set(flicker, flicker, flicker);
      } else {
        lanternPointLight.intensity = 0;
        flameMesh.visible = false;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      baseGeo.dispose();
      glassGeo.dispose();
      strutGeo.dispose();
      collarGeo.dispose();
      roofGeo.dispose();
      finialGeo.dispose();
      ringGeo.dispose();
      candleGeo.dispose();
      flameGeo.dispose();
      shadowGeo.dispose();

      brassMat.dispose();
      glassMat.dispose();
      candleMat.dispose();
      flameMat.dispose();
      shadowMat.dispose();

      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`w-full h-full relative cursor-grab active:cursor-grabbing select-none ${className}`}
      title="Interactive 3D Lantern — Drag to rotate"
      role="img"
      aria-label="Interactive 3D Nightlight Lantern"
    />
  );
};
