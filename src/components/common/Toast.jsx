import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Toast() {
  const { toastMessage } = useCart();

  const getIcon = (type) => {
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
    <AnimatePresence>
      {toastMessage && (
        <m.div
          key={toastMessage.id || 'toast'}
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            background: '#1c1917',
            border: '1px solid rgba(212, 166, 74, 0.3)',
            borderRadius: '999px',
            padding: '10px 18px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(212, 166, 74, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#F6EFE3',
            fontSize: '0.84rem',
            fontWeight: 600,
            pointerEvents: 'none',
          }}
        >
          {getIcon(toastMessage.type)}
          <span>{toastMessage.message}</span>
        </m.div>
      )}
    </AnimatePresence>
  );
}
