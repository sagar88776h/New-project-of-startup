import React from 'react';

export default function CardWrapper({ children, className = '', onClick, style = {} }) {
  return (
    <div
      className={`restaurant-card ${className}`}
      onClick={onClick}
      style={{
        ...style,
      }}
    >
      {children}
    </div>
  );
}
