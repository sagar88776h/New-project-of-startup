import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function FoodDetailCanvas({ imageUrl, dishName, primaryColor = '#c99738' }) {
  const mountRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 360;
    const height = mount.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.6, 3.8);
    camera.lookAt(0, 0.1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    mount.appendChild(renderer.domElement);

    const dishGroup = new THREE.Group();
    scene.add(dishGroup);

    // Designer Porcelain / Slate Base Plate
    const plateGeom = new THREE.CylinderGeometry(1.5, 1.25, 0.12, 48);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x14151a,
      roughness: 0.3,
      metalness: 0.3,
    });
    const plate = new THREE.Mesh(plateGeom, plateMat);
    plate.position.y = -0.06;
    dishGroup.add(plate);

    // Gold Inner Inlay Ring
    const goldRingGeom = new THREE.RingGeometry(1.35, 1.42, 48);
    const goldRingMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(primaryColor),
      roughness: 0.2,
      metalness: 0.85,
      side: THREE.DoubleSide,
    });
    const goldRing = new THREE.Mesh(goldRingGeom, goldRingMat);
    goldRing.rotation.x = -Math.PI / 2;
    goldRing.position.y = 0.01;
    dishGroup.add(goldRing);

    // Food Surface Disc
    const foodGeom = new THREE.CylinderGeometry(1.3, 1.3, 0.08, 48);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageUrl, (texture) => {
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      const foodMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.65,
      });
      const foodMesh = new THREE.Mesh(foodGeom, foodMat);
      foodMesh.position.y = 0.04;
      dishGroup.add(foodMesh);
    });

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.2);
    keyLight.position.set(2, 4, 3);
    scene.add(keyLight);

    const rimLight = new THREE.SpotLight(new THREE.Color(primaryColor), 2.5);
    rimLight.position.set(-3, 3, -2);
    rimLight.lookAt(0, 0, 0);
    scene.add(rimLight);

    // Interactive Drag / Orbit
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let rotX = 0.3;
    let rotY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      setAutoRotate(false);
      prevX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      prevY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      const deltaX = clientX - prevX;
      const deltaY = clientY - prevY;

      rotY += deltaX * 0.012;
      rotX += deltaY * 0.008;

      // Clamp vertical tilt
      rotX = Math.max(0.1, Math.min(Math.PI / 2.6, rotX));

      prevX = clientX;
      prevY = clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    mount.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    mount.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      if (!isDragging && autoRotate) {
        rotY += 0.008;
      }

      dishGroup.rotation.x = rotX;
      dishGroup.rotation.y = rotY;
      dishGroup.position.y = Math.sin(elapsed * 1.8) * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      mount.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      mount.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [imageUrl, primaryColor, autoRotate]);

  return (
    <div className="detail-3d-canvas-container">
      <div className="glow-ring" />
      <div ref={mountRef} className="hero-3d-canvas" />
      
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '999px',
          padding: '4px 10px',
          fontSize: '0.7rem',
          color: '#e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          pointerEvents: 'none',
        }}
      >
        <span>360° 3D Platter</span>
      </div>
    </div>
  );
}
