import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function HeroFoodCanvas({ coverImage, restaurantName, primaryColor = '#c99738' }) {
  const mountRef = useRef(null);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch (e) {
      setWebGlSupported(false);
      return;
    }

    // Three.js Scene Setup
    const width = mount.clientWidth || 380;
    const height = mount.clientHeight || 260;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 4.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mount.appendChild(renderer.domElement);

    // Group for rotating dish
    const dishGroup = new THREE.Group();
    scene.add(dishGroup);

    // Gourmet Platter Base (Slate & Gold Rim Plate)
    const plateGeometry = new THREE.CylinderGeometry(1.6, 1.35, 0.14, 48);
    const plateMaterial = new THREE.MeshStandardMaterial({
      color: 0x181920,
      roughness: 0.35,
      metalness: 0.4,
    });
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    plate.position.y = -0.07;
    plate.receiveShadow = true;
    dishGroup.add(plate);

    // Gold Rim Accent
    const goldRimGeometry = new THREE.TorusGeometry(1.58, 0.04, 16, 64);
    const goldRimMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(primaryColor),
      roughness: 0.2,
      metalness: 0.9,
    });
    const goldRim = new THREE.Mesh(goldRimGeometry, goldRimMaterial);
    goldRim.rotation.x = Math.PI / 2;
    goldRim.position.y = 0.01;
    dishGroup.add(goldRim);

    // Food Center Dome / Texture Disc
    const foodCenterGeom = new THREE.CylinderGeometry(1.4, 1.4, 0.08, 48);
    
    // Texture Loader for food image
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      coverImage,
      (texture) => {
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        const foodMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.6,
          metalness: 0.1,
        });
        const foodDisc = new THREE.Mesh(foodCenterGeom, foodMaterial);
        foodDisc.position.y = 0.05;
        dishGroup.add(foodDisc);
      },
      undefined,
      () => {
        // Fallback procedural food mound
        const fallbackGeom = new THREE.SphereGeometry(1.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.5);
        const fallbackMat = new THREE.MeshStandardMaterial({
          color: 0xc4823f,
          roughness: 0.7,
        });
        const fallbackFood = new THREE.Mesh(fallbackGeom, fallbackMat);
        fallbackFood.position.y = 0.02;
        dishGroup.add(fallbackFood);
      }
    );

    // Floating Golden Ember / Saffron Flake Particles
    const particleCount = 28;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2.8;
      positions[i * 3 + 1] = Math.random() * 1.5 + 0.1;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.8;
      scales[i] = Math.random() * 0.04 + 0.02;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: new THREE.Color(primaryColor),
      size: 0.06,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    dishGroup.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const goldSpotLight = new THREE.SpotLight(new THREE.Color(primaryColor), 3.5);
    goldSpotLight.position.set(2, 4, 3);
    goldSpotLight.angle = Math.PI / 4;
    goldSpotLight.penumbra = 0.8;
    goldSpotLight.castShadow = true;
    scene.add(goldSpotLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.5);
    rimLight.position.set(-3, 2, -2);
    scene.add(rimLight);

    // Mouse / Touch Parallax Interaction
    let targetRotationX = 0.35;
    let targetRotationY = 0;
    let currentRotationX = 0.35;
    let currentRotationY = 0;
    let isDragging = false;
    let previousMouseX = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      setIsInteracting(true);
      previousMouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    };

    const onPointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

      if (isDragging) {
        const deltaX = clientX - previousMouseX;
        targetRotationY += deltaX * 0.012;
        previousMouseX = clientX;
      } else {
        // Subtle Parallax when hovering
        const rect = mount.getBoundingClientRect();
        const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);
        targetRotationX = 0.35 + normY * 0.15;
        targetRotationY += normX * 0.005;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
      setIsInteracting(false);
    };

    mount.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    mount.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle auto rotation
      if (!isDragging) {
        targetRotationY += 0.004;
      }

      // Smooth interpolation (lerp)
      currentRotationX += (targetRotationX - currentRotationX) * 0.06;
      currentRotationY += (targetRotationY - currentRotationY) * 0.06;

      dishGroup.rotation.x = currentRotationX;
      dishGroup.rotation.y = currentRotationY;

      // Floating gentle wobble
      dishGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.04;

      // Animate particles
      const pos = particleGeom.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += Math.sin(elapsedTime * 2 + i) * 0.002;
      }
      particleGeom.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!mount) return;
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
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
  }, [coverImage, primaryColor]);

  // Fallback high-def static image with subtle CSS 3D parallax if WebGL is unavailable
  if (!webGlSupported) {
    return (
      <div className="hero-3d-canvas-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img
          src={coverImage}
          alt={restaurantName}
          style={{ width: '85%', height: '85%', objectFit: 'cover', borderRadius: '50%', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
        />
      </div>
    );
  }

  return (
    <div className="hero-3d-canvas-container">
      <div className="glow-ring" />
      <div ref={mountRef} className="hero-3d-canvas" title="Drag to rotate 3D gourmet platter" />
      
      {/* 3D Interaction Hint Badge */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '12px',
          background: 'rgba(0, 0, 0, 0.65)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '4px 10px',
          borderRadius: '999px',
          fontSize: '0.65rem',
          color: '#e5e7eb',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          pointerEvents: 'none',
          backdropFilter: 'blur(6px)',
        }}
      >
        <span>🔄 Drag to view in 3D</span>
      </div>
    </div>
  );
}
