import React, { useRef, useState } from 'react';

export default function Card3DWrapper({ children, className = '', onClick, style = {} }) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate subtle tilt angle (max ±7 degrees)
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    // Glare coordinates in percentage
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`);
    setGlarePosition({ x: glareX, y: glareY, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePosition(prev => ({ ...prev, opacity: 0 }));
  };

  // Subtle mobile touch effect
  const handleTouchStart = () => {
    setTransformStyle('perspective(1000px) scale3d(0.985, 0.985, 0.985)');
  };

  const handleTouchEnd = () => {
    setTransformStyle('perspective(1000px) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={cardRef}
      className={`card-3d ${className}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: transformStyle,
        ...style,
      }}
    >
      {children}
      <div
        className="card-3d-glare"
        style={{
          '--mouse-x': `${glarePosition.x}%`,
          '--mouse-y': `${glarePosition.y}%`,
          opacity: glarePosition.opacity,
        }}
      />
    </div>
  );
}
