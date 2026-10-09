import React from 'react';
import { motion } from 'framer-motion';

export default function CardWrapper({ children, className = '', onClick, style = {} }) {
  return (
    <motion.div
      className={`restaurant-card ${className}`}
      onClick={onClick}
      whileHover={{
        y: -3,
        scale: 1.01,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45), 0 2px 8px rgba(212, 166, 74, 0.15)',
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      style={{
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}
