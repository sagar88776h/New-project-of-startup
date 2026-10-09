import React from 'react';
import { m } from 'framer-motion';

export default function CardWrapper({ children, className = '', onClick, style = {} }) {
  return (
    <m.div
      className={`restaurant-card ${className}`}
      onClick={onClick}
      whileHover={{
        y: -3,
        scale: 1.01,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        ...style,
      }}
    >
      {children}
    </m.div>
  );
}
