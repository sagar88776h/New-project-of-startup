import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Toast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  const { message, type = 'info' } = toastMessage;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} color="#10b981" />;
      case 'warning':
        return <AlertTriangle size={16} color="#f59e0b" />;
      default:
        return <Info size={16} color="#3b82f6" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '18px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1100,
        background: 'rgba(20, 23, 33, 0.95)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(201, 151, 56, 0.2)',
        borderRadius: '999px',
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: '#ffffff',
        fontSize: '0.85rem',
        fontWeight: 600,
        maxWidth: '90vw',
        animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: 'none',
      }}
    >
      {getIcon()}
      <span>{message}</span>
    </div>
  );
}
