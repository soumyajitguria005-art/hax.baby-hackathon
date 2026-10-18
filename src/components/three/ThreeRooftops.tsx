import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeRooftopsProps {
  isDelivering: boolean;
  flightProgress: number;
  className?: string;
}

export const ThreeRooftops: React.FC<ThreeRooftopsProps> = ({
  isDelivering,
  flightProgress,
  className = '',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isDeliveringRef = useRef(isDelivering);
  const progressRef = useRef(flightProgress);

  isDeliveringRef.current = isDelivering;
  progressRef.current = flightProgress;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 180;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 5.2);
    camera.lookAt(0, 0.4, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x382d48, 1.6);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0xc4b5fd, 2.2);
    moonLight.position.set(-3, 6, 4);
    scene.add(moonLight);

    const windowLight = new THREE.PointLight(0xf1c66d, 1.8, 5);
    windowLight.position.set(0, 0.6, 0.8);
    scene.add(windowLight);

    // 3. Procedural Rooftops Village Diorama
    const villageGroup = new THREE.Group();
    scene.add(villageGroup);

    // Materials
    const houseWallMat = new THREE.MeshStandardMaterial({
      color: 0x271e35,
      roughness: 0.7,
      metalness: 0.1,
    });

    const roofSlateMat = new THREE.MeshStandardMaterial({
      color: 0x4a3b5c,
      roughness: 0.4,
      metalness: 0.2,
    });

    const windowGlowMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.85,
      roughness: 0.2,
    });

    const chimneyMat = new THREE.MeshStandardMaterial({
      color: 0x3d2943,
      roughness: 0.8,
    });

    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      emissive: 0xec4899,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });

    const starTrailMat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      dashSize: 0.2,
      gapSize: 0.1,
      linewidth: 2,
    });

    // Helper: Create a cozy cottage house
    const createHouse = (x: number, z: number, scaleY: number, roofColor: number) => {
      const house = new THREE.Group();
      house.position.set(x, 0, z);

      // Body
      const bodyGeo = new THREE.BoxGeometry(1.2, scaleY, 1.1);
      const bodyMesh = new THREE.Mesh(bodyGeo, houseWallMat);
      bodyMesh.position.y = scaleY / 2;
      house.add(bodyMesh);

      // Pitched Roof
      const roofGeo = new THREE.ConeGeometry(0.95, 0.75, 4);
      const rMat = roofSlateMat.clone();
      rMat.color.setHex(roofColor);
      const roofMesh = new THREE.Mesh(roofGeo, rMat);
      roofMesh.position.y = scaleY + 0.35;
      roofMesh.rotation.y = Math.PI / 4;
      house.add(roofMesh);

      // Chimney
      const chimGeo = new THREE.BoxGeometry(0.2, 0.5, 0.2);
      const chimMesh = new THREE.Mesh(chimGeo, chimneyMat);
      chimMesh.position.set(0.28, scaleY + 0.45, 0.15);
      house.add(chimMesh);

      // Glowing Windows
      const winGeo = new THREE.PlaneGeometry(0.25, 0.25);
      const winMesh1 = new THREE.Mesh(winGeo, windowGlowMat);
      winMesh1.position.set(-0.25, scaleY * 0.65, 0.56);
      house.add(winMesh1);

      const winMesh2 = new THREE.Mesh(winGeo, windowGlowMat);
      winMesh2.position.set(0.25, scaleY * 0.45, 0.56);
      house.add(winMesh2);

      villageGroup.add(house);
    };

    // 3 Houses in neighborhood
    createHouse(-1.3, -0.2, 1.1, 0x5b3a6b);
    createHouse(0, 0.1, 1.35, 0x433252);
    createHouse(1.3, -0.3, 0.95, 0x6d4078);

    // Flight Curve Route
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.2, 1.1, 0.8),
      new THREE.Vector3(-1.1, 2.1, 0.4),
      new THREE.Vector3(0, 2.5, -0.2),
      new THREE.Vector3(1.1, 1.9, 0.5),
      new THREE.Vector3(2.2, 1.2, 0.7),
    ]);

    const points = curve.getPoints(50);
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeo, starTrailMat);
    line.computeLineDistances();
    villageGroup.add(line);

    // Flying Stardust Delivery Beacon (Pip's Cloud Bundle)
    const beaconGroup = new THREE.Group();
    const beaconGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
    beaconGroup.add(beaconMesh);

    // Stardust halo
    const haloGeo = new THREE.RingGeometry(0.18, 0.25, 16);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xf1c66d,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    beaconGroup.add(haloMesh);

    villageGroup.add(beaconGroup);

    // Ground platform
    const groundGeo = new THREE.CylinderGeometry(2.8, 2.8, 0.15, 24);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1b1325,
      roughness: 0.9,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.position.y = -0.075;
    villageGroup.add(groundMesh);

    // Interactive Drag / Hover rotation
    let isDragging = false;
    let prevMouseX = 0;
    let targetRotationY = -0.2;
    let currentRotationY = -0.2;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) {
        const rect = container.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        targetRotationY = -0.2 + normX * 0.6;
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

      currentRotationY = THREE.MathUtils.damp(currentRotationY, targetRotationY, 8, delta);
      villageGroup.rotation.y = currentRotationY;

      // Position beacon along curve based on flightProgress
      const t = progressRef.current / 100;
      const point = curve.getPoint(Math.min(1, Math.max(0, t)));
      beaconGroup.position.copy(point);

      // Subtle beacon bob & spin
      beaconGroup.rotation.y += delta * 2;
      haloMesh.rotation.z += delta * 3;
      if (isDeliveringRef.current) {
        beaconGroup.position.y += Math.sin(elapsed * 8) * 0.04;
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

      lineGeo.dispose();
      beaconGeo.dispose();
      haloGeo.dispose();
      groundGeo.dispose();

      houseWallMat.dispose();
      roofSlateMat.dispose();
      windowGlowMat.dispose();
      chimneyMat.dispose();
      beaconMat.dispose();
      starTrailMat.dispose();
      haloMat.dispose();
      groundMat.dispose();

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
      title="Interactive 3D Rooftops — Drag to rotate diorama"
      role="img"
      aria-label="Interactive 3D Rooftop Map Diorama"
    />
  );
};
