import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Droplets, Utensils, Receipt, FileText } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { modalBackdropVariants, bottomSheetVariants } from '../../lib/motion';

export default function CallWaiterModal({ isOpen, onClose }) {
  const { tableNumber, callWaiter } = useCart();
  const { activeRestaurant } = useRestaurant();
  const { theme } = activeRestaurant;

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      return () => document.body.classList.remove('modal-open');
    }
  }, [isOpen]);

  const handleAction = (serviceName) => {
    callWaiter(serviceName);
    onClose();
  };

  const services = [
    { title: 'Call Waiter', desc: 'General table assistance', icon: <Bell size={20} color="#f59e0b" />, action: 'General Assistance' },
    { title: 'Request Water', desc: 'Complimentary cold drinking water', icon: <Droplets size={20} color="#38bdf8" />, action: 'Drinking Water' },
    { title: 'Cutlery & Plates', desc: 'Extra forks, spoons, or small bowls', icon: <Utensils size={20} color="#10b981" />, action: 'Fresh Cutlery & Plates' },
    { title: 'Extra Napkins', desc: 'Paper napkins & wet wipes', icon: <FileText size={20} color="#a78bfa" />, action: 'Extra Napkins' },
    { title: 'Request Table Bill', desc: 'Cash / Card / UPI machine to table', icon: <Receipt size={20} color={theme.primaryColor || '#c99738'} />, action: 'Bill & Payment Machine' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="call-waiter-backdrop"
          variants={modalBackdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="modal-overlay active"
          onClick={onClose}
        >
          <motion.div
            key="call-waiter-sheet"
            variants={bottomSheetVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bottom-sheet"
            onClick={e => e.stopPropagation()}
            style={{ maxHeight: '90dvh', height: 'auto', padding: '20px 18px max(20px, env(safe-area-inset-bottom, 20px))', overflowY: 'auto', overscrollBehavior: 'contain' }}
          >
            <div className="sheet-handle" />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={20} color="var(--color-primary)" />
                <div>
                  <h3 style={{ fontFamily: theme.fontHeading || "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    Table Service & Assistance
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                    Table {tableNumber || '?'}
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                aria-label="Close modal"
                className="touch-target-44"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: 'var(--color-text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </motion.button>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
              Select a service request below and our floor staff will attend to your table immediately.
            </p>

            {/* Service Options List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {services.map((svc, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -2, scale: 1.01 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAction(svc.action)}
                  className="touch-target-44"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--color-card-border)',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease, background 0.2s ease',
                    minHeight: '44px',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {svc.icon}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '2px' }}>
                      {svc.title}
                    </h4>
                    <p style={{ fontSize: '0.74rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                      {svc.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
