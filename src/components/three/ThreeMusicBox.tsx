import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeMusicBoxProps {
  isPlaying: boolean;
  className?: string;
}

export const ThreeMusicBox: React.FC<ThreeMusicBoxProps> = ({ isPlaying, className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 180;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.8, 4.6);
    camera.lookAt(0, 0.3, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 2. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xfff0f5, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffecd2, 2.4);
    keyLight.position.set(4, 5, 3);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc4b5fd, 1.5);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    // 3. Procedural 3D Music Box Assembly (Group of 8+ distinct parts)
    const musicBoxGroup = new THREE.Group();
    scene.add(musicBoxGroup);

    // Materials
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x4c1d95, // Deep royal purple velvet finish
      roughness: 0.35,
      metalness: 0.1,
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24, // Lustrous polished brass / gold
      roughness: 0.22,
      metalness: 0.88,
    });

    const steelMat = new THREE.MeshStandardMaterial({
      color: 0xf1f5f9,
      roughness: 0.15,
      metalness: 0.95,
    });

    const noteMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      roughness: 0.3,
      metalness: 0.5,
      emissive: 0xdb2777,
      emissiveIntensity: 0.35,
    });

    // Part 1: Main Wooden Box Base
    const boxGeo = new THREE.BoxGeometry(2.2, 0.85, 1.6);
    const boxMesh = new THREE.Mesh(boxGeo, woodMat);
    boxMesh.position.y = 0.425;
    musicBoxGroup.add(boxMesh);

    // Part 2: Gold Inlay Bevel Rim
    const rimGeo = new THREE.BoxGeometry(2.28, 0.08, 1.68);
    const rimMesh = new THREE.Mesh(rimGeo, goldMat);
    rimMesh.position.y = 0.85;
    musicBoxGroup.add(rimMesh);

    // Part 3: Open Angled Lid
    const lidGeo = new THREE.BoxGeometry(2.24, 0.08, 1.64);
    const lidMesh = new THREE.Mesh(lidGeo, woodMat);
    lidMesh.position.set(0, 1.35, -0.65);
    lidMesh.rotation.x = -Math.PI / 4; // Open lid angle
    musicBoxGroup.add(lidMesh);

    // Part 4: Interior Gold Mirror / Plate
    const plateGeo = new THREE.PlaneGeometry(1.9, 1.3);
    const plateMesh = new THREE.Mesh(plateGeo, goldMat);
    plateMesh.rotation.x = -Math.PI / 2;
    plateMesh.position.set(0, 0.87, 0);
    musicBoxGroup.add(plateMesh);

    // Part 5: Rotating Music Cylinder
    const cylinderGeo = new THREE.CylinderGeometry(0.24, 0.24, 1.2, 24);
    const cylinderMesh = new THREE.Mesh(cylinderGeo, steelMat);
    cylinderMesh.rotation.z = Math.PI / 2;
    cylinderMesh.position.set(0, 1.05, 0.1);
    musicBoxGroup.add(cylinderMesh);

    // Part 6: Comb Teeth (Celesta Tone Bars)
    const combGeo = new THREE.BoxGeometry(1.2, 0.04, 0.3);
    const combMesh = new THREE.Mesh(combGeo, steelMat);
    combMesh.position.set(0, 0.98, -0.22);
    musicBoxGroup.add(combMesh);

    // Part 7: Wind-Up Key on the Right Flank
    const windupGroup = new THREE.Group();
    windupGroup.position.set(1.15, 0.45, 0);

    const shaftGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.25, 12);
    const shaftMesh = new THREE.Mesh(shaftGeo, goldMat);
    shaftMesh.rotation.z = Math.PI / 2;
    windupGroup.add(shaftMesh);

    const keyHeadGeo = new THREE.TorusGeometry(0.18, 0.04, 12, 24);
    const keyHeadMesh = new THREE.Mesh(keyHeadGeo, goldMat);
    keyHeadMesh.position.x = 0.22;
    keyHeadMesh.rotation.y = Math.PI / 2;
    windupGroup.add(keyHeadMesh);

    musicBoxGroup.add(windupGroup);

    // Part 8: 4 Gold Ornate Feet
    const footGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.15, 12);
    const footPositions = [
      [-1, 0.075, -0.7],
      [1, 0.075, -0.7],
      [-1, 0.075, 0.7],
      [1, 0.075, 0.7],
    ];
    footPositions.forEach(([x, y, z]) => {
      const foot = new THREE.Mesh(footGeo, goldMat);
      foot.position.set(x, y, z);
      musicBoxGroup.add(foot);
    });

    // Part 9: Floating 3D Musical Notes
    const notesGroup = new THREE.Group();
    musicBoxGroup.add(notesGroup);

    const noteGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const stemGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.22, 8);

    const notes: THREE.Group[] = [];
    for (let i = 0; i < 3; i++) {
      const nGroup = new THREE.Group();
      const head = new THREE.Mesh(noteGeo, noteMat);
      const stem = new THREE.Mesh(stemGeo, noteMat);
      stem.position.set(0.06, 0.1, 0);
      nGroup.add(head);
      nGroup.add(stem);
      nGroup.position.set((i - 1) * 0.4, 1.2 + i * 0.2, (Math.random() - 0.5) * 0.4);
      notes.push(nGroup);
      notesGroup.add(nGroup);
    }

    // Part 10: Ground Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(3.2, 2.4);
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
    let targetRotationY = 0.35;
    let currentRotationY = 0.35;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) {
        // Subtle hover tilt
        const rect = container.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        targetRotationY = 0.35 + normX * 0.6;
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
      musicBoxGroup.rotation.y = currentRotationY;

      // When playing, spin cylinder & wind-up key, and float notes
      if (isPlayingRef.current) {
        cylinderMesh.rotation.x += delta * 3.5;
        windupGroup.rotation.x += delta * 2.8;

        notes.forEach((note, idx) => {
          note.position.y += delta * 0.4;
          note.position.x += Math.sin(elapsed * 3 + idx) * 0.003;
          if (note.position.y > 2.2) {
            note.position.y = 1.1;
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
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

      // Clean up geometries and materials
      boxGeo.dispose();
      rimGeo.dispose();
      lidGeo.dispose();
      plateGeo.dispose();
      cylinderGeo.dispose();
      combGeo.dispose();
      shaftGeo.dispose();
      keyHeadGeo.dispose();
      footGeo.dispose();
      noteGeo.dispose();
      stemGeo.dispose();
      shadowGeo.dispose();

      woodMat.dispose();
      goldMat.dispose();
      steelMat.dispose();
      noteMat.dispose();
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
      title="Interactive 3D Music Box — Drag to rotate"
      role="img"
      aria-label="Interactive 3D Celesta Music Box"
    />
  );
};
